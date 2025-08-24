// INSTANT ZOMBIE POLLING FIX
// Copy and paste this into browser console to immediately fix the stuck UI

console.log('🚨 INSTANT FIX: Performing nuclear reset...');

// Kill ALL intervals (brute force)
for (let i = 1; i < 99999; i++) {
  try {
    clearInterval(i);
  } catch(e) {}
}

// Kill ALL timeouts too
for (let i = 1; i < 99999; i++) {
  try {
    clearTimeout(i);
  } catch(e) {}
}

// Clear zombie localStorage data
localStorage.removeItem('activeSongId');
localStorage.removeItem('zombieCounter');

console.log('✅ Nuclear reset complete! Now refresh the page (Cmd+Shift+R or Ctrl+Shift+R)');

// Auto-refresh after 2 seconds
setTimeout(() => {
  console.log('🔄 Auto-refreshing page...');
  window.location.reload(true); // Hard refresh
}, 2000);