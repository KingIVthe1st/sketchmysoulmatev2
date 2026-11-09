# ElevenLabs credential handling

Never put a real API key in source code, deployment instructions, reports, logs, or screenshots. Use `ELEVENLABS_API_KEY` in the server environment or an ignored local environment file. Keep `.env.example` as placeholders only. Never use a `NEXT_PUBLIC_` variable for a secret.

The manual deployment generators print literal commands, not the value of the key in the shell running the generator. On the deployment server, configure `ELEVENLABS_API_KEY` securely before running those commands. The generated commands reject an unset or empty key before changing files or stopping services, then export the existing value without overwriting it. Do not put a replacement key into these scripts.

## Responding to an exposed key

1. Revoke each exposed credential in the ElevenLabs account. Removing it from the latest source does not invalidate the key. Check provider usage for unexpected activity.
2. If a service still needs ElevenLabs, create an appropriately restricted replacement and configure it through that deployment's protected environment/secret settings. Obtain the required account and deployment approvals before making these changes.
3. Identify every consumer of `ELEVENLABS_API_KEY`, including the DigitalOcean application at `/var/www/music-moments`, local environments, and any Render services. Source references alone do not establish which deployments are currently running. Revocation can interrupt consumers until they receive a replacement.
4. Old Git commits, clones, forks, and cached views may retain the revoked values. If history cleanup is required, coordinate a separate history rewrite across affected repositories and branches, then follow GitHub's sensitive-data removal process. A normal commit does not erase history, and history cleanup is not a substitute for revocation.

## Offline regression checks

Run `npm run test:security` (Python 3 and Bash required). These checks scan project sources for `sk_` followed by 20 or more alphanumeric characters (a narrow key-pattern check, not a comprehensive secret scanner), verify both shell layers parse, verify that absent/empty keys stop the preflight, and verify that a dummy value is preserved and not printed. They do not run a deployment or call ElevenLabs.
