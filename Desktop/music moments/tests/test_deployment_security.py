"""Offline regression checks; never execute a deployment or call an external API."""
import os
from pathlib import Path
import re
import subprocess
import unittest

PROJECT = Path(__file__).resolve().parents[1]
SCRIPTS = (
    'deploy-via-http.sh',
    'complete-deployment-guide.sh',
    'quick-deploy-elevenlabs.sh',
    'digitalocean-console-deployment.sh',
)
DUMMY = 'offline-test-value-not-a-real-key'


def deployment_commands(name):
    source = (PROJECT / name).read_text()
    opening = re.search(r"^cat << '([A-Z_]+)'\n", source, re.MULTILINE)
    if opening is None:
        raise AssertionError(f'{name}: deployment command block not found')
    return source[opening.end():].split('\n' + opening.group(1) + '\n', 1)[0]


def preflight(name):
    # Run only validation before the first directory change, never deployment commands.
    commands = deployment_commands(name)
    return re.split(r'^cd ', commands, maxsplit=1, flags=re.MULTILINE)[0]


class DeploymentSecurityTests(unittest.TestCase):
    def test_no_key_literals_in_project_sources(self):
        pattern = re.compile(r'\bsk_[A-Za-z0-9]{20,}\b')
        hits = []
        for path in PROJECT.rglob('*'):
            if not path.is_file() or any(part in ('.git', 'node_modules', '.next') for part in path.parts):
                continue
            try:
                source = path.read_text()
            except (UnicodeError, OSError):
                continue
            if pattern.search(source):
                hits.append(str(path.relative_to(PROJECT)))
        self.assertEqual(len(hits), 0, 'Credential-like literals found in: ' + ', '.join(hits))

    def test_missing_or_empty_key_stops_before_deployment(self):
        for name in SCRIPTS:
            for value in (None, ''):
                with self.subTest(script=name, key='unset' if value is None else 'empty'):
                    env = os.environ.copy()
                    env.pop('ELEVENLABS_API_KEY', None)
                    if value is not None:
                        env['ELEVENLABS_API_KEY'] = value
                    result = subprocess.run(['bash', '-c', preflight(name) + '\necho PREFLIGHT_PASSED'],
                                            env=env, capture_output=True, text=True)
                    self.assertNotEqual(result.returncode, 0, f'{name}: missing key did not stop deployment')
                    self.assertNotIn('PREFLIGHT_PASSED', result.stdout)
                    self.assertIn('ELEVENLABS_API_KEY', result.stderr)

    def test_existing_key_is_preserved_and_exported(self):
        for name in SCRIPTS:
            with self.subTest(script=name):
                env = os.environ.copy()
                env.pop('ELEVENLABS_API_KEY', None)
                source = ('ELEVENLABS_API_KEY=' + DUMMY + '\n' + preflight(name)
                          + '\nbash -c \'test "$ELEVENLABS_API_KEY" = "' + DUMMY + '"\'')
                result = subprocess.run(['bash', '-c', source], env=env, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, f'{name}: existing key was not exported intact')
                self.assertNotIn(DUMMY, result.stdout + result.stderr)

    def test_shell_tracing_does_not_print_the_key(self):
        for name in SCRIPTS:
            with self.subTest(script=name):
                env = os.environ.copy()
                env['ELEVENLABS_API_KEY'] = DUMMY
                result = subprocess.run(['bash', '-x', '-c', preflight(name)], env=env,
                                        capture_output=True, text=True)
                self.assertEqual(result.returncode, 0)
                self.assertNotIn(DUMMY, result.stdout + result.stderr)

    def test_generated_commands_never_replace_or_unset_the_key(self):
        pattern = re.compile(r'^\s*(?:export\s+)?ELEVENLABS_API_KEY\s*=|^\s*unset\b[^\n]*\bELEVENLABS_API_KEY\b', re.MULTILINE)
        for name in SCRIPTS:
            with self.subTest(script=name):
                self.assertIsNone(pattern.search(deployment_commands(name)),
                                  f'{name}: key is reassigned or unset')

    def test_instruction_output_does_not_expand_the_key(self):
        for name in SCRIPTS:
            with self.subTest(script=name):
                env = os.environ.copy()
                env['ELEVENLABS_API_KEY'] = DUMMY
                result = subprocess.run(['bash', str(PROJECT / name)], env=env, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0)
                self.assertNotIn(DUMMY, result.stdout + result.stderr)

    def test_generator_and_generated_commands_have_valid_bash_syntax(self):
        for name in SCRIPTS:
            with self.subTest(script=name):
                result = subprocess.run(['bash', '-n', str(PROJECT / name)], capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, f'{name}: generator syntax error')
                result = subprocess.run(['bash', '-n'], input=deployment_commands(name), capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, f'{name}: generated command syntax error')


if __name__ == '__main__':
    unittest.main(verbosity=2)
