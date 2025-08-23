// Debug script to check step navigation
console.log('=== STEP NAVIGATION DEBUG ===');

// Check current step sections
const stepSections = Array.from(document.querySelectorAll(".order-step"));
console.log('Step sections found:', stepSections.length);
stepSections.forEach((section, index) => {
  console.log(`Index ${index}: ${section.id} - Display: ${section.style.display}`);
});

// Check current step variable
console.log('Current step variable:', window.currentStep || 'undefined');

// Check if step5 exists
const step5 = document.getElementById('step5');
console.log('Step 5 element exists:', !!step5);
if (step5) {
  console.log('Step 5 display:', step5.style.display);
}

// Test goToStep function
if (typeof goToStep === 'function') {
  console.log('goToStep function exists');
  console.log('Attempting to go to step 5...');
  goToStep(5);
} else {
  console.log('goToStep function not found');
}
