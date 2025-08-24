const testEnhancedPersonalization = async () => {
  console.log('🎵 Testing Enhanced AI Personalization Features')
  console.log('=' .repeat(60))
  
  const testScenarios = [
    {
      name: "Anniversary Memory",
      data: {
        story: "I remember our first dance at our wedding five years ago. You looked so beautiful in that white dress, and when they played 'At Last' by Etta James, I knew I was the luckiest person in the world. We've been through so much together - buying our first house, getting our dog Max, and even when I lost my job last year, you supported me through everything. I love how you make coffee for me every morning and leave little notes in my lunch bag.",
        recipient: "Sarah",
        relationship: "wife",
        occasion: "anniversary",
        genre: "ballad",
        vibe: "romantic",
        selectedVoiceId: "test-voice",
        selectedVoiceCategory: "warm",
        emotion: "romantic",
        style: "pop"
      }
    },
    {
      name: "Mother's Birthday",
      data: {
        story: "Mom, you've always been my rock. I remember when I was scared to start school, you walked me to the classroom every day for a month until I felt comfortable. When I broke my arm playing soccer, you stayed with me all night at the hospital. You taught me how to cook your famous lasagna recipe, and now I make it for my own family. Your strength and love have shaped who I am today.",
        recipient: "Mom",
        relationship: "mother",
        occasion: "birthday", 
        genre: "country",
        vibe: "nostalgic",
        selectedVoiceId: "test-voice",
        selectedVoiceCategory: "professional",
        emotion: "happy",
        style: "folk"
      }
    },
    {
      name: "Best Friend Celebration",
      data: {
        story: "Jake, we've been best friends since middle school. Remember when we started that garage band and thought we'd be rock stars? We practiced every day after school, even though we were terrible! You were there when I got rejected by my crush, and I was there when you finally asked out Emma. We've traveled across the country together, shared countless adventures, and even though we live in different cities now, our friendship never changes.",
        recipient: "Jake",
        relationship: "best friend", 
        occasion: "friendship celebration",
        genre: "rock",
        vibe: "energetic",
        selectedVoiceId: "test-voice",
        selectedVoiceCategory: "professional",
        emotion: "excited",
        style: "rock"
      }
    }
  ]
  
  for (const scenario of testScenarios) {
    console.log(`\n🎯 Testing: ${scenario.name}`)
    console.log('-'.repeat(40))
    
    try {
      const response = await fetch('http://localhost:3003/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scenario.data)
      })
      
      const result = await response.json()
      
      if (result.error) {
        console.log('❌ Error:', result.error)
        if (result.details) {
          console.log('   Details:', result.details)
        }
        continue
      }
      
      console.log('✅ Success!')
      console.log('📝 Generated Lyrics Preview:')
      const lyricsPreview = result.lyrics ? result.lyrics.substring(0, 200) + '...' : 'No lyrics generated'
      console.log('   ' + lyricsPreview.replace(/\n/g, '\n   '))
      
      // Check for enhanced AI features
      console.log('\n🧠 AI Intelligence Check:')
      
      // Check if story elements are incorporated
      const storyWords = scenario.data.story.toLowerCase().split(' ').filter(w => w.length > 4)
      const lyricsLower = result.lyrics ? result.lyrics.toLowerCase() : ''
      const incorporatedWords = storyWords.filter(word => lyricsLower.includes(word.substring(0, 6)))
      
      if (incorporatedWords.length > 0) {
        console.log(`   ✅ Story incorporation: Found ${incorporatedWords.length} story elements in lyrics`)
        console.log(`      Examples: ${incorporatedWords.slice(0, 3).join(', ')}`)
      } else {
        console.log('   ❌ Story incorporation: No clear story elements found')
      }
      
      // Check for relationship-appropriate language
      const relationship = scenario.data.relationship.toLowerCase()
      if (relationship === 'wife' && lyricsLower.includes('my wife')) {
        console.log('   ✅ Relationship context: Wife relationship recognized')
      } else if (relationship === 'mother' && (lyricsLower.includes('mom') || lyricsLower.includes('mother'))) {
        console.log('   ✅ Relationship context: Mother relationship recognized')  
      } else if (relationship.includes('friend') && lyricsLower.includes('friend')) {
        console.log('   ✅ Relationship context: Friend relationship recognized')
      } else {
        console.log(`   ⚠️  Relationship context: ${relationship} not clearly reflected`)
      }
      
      // Check for occasion-specific content
      const occasion = scenario.data.occasion.toLowerCase()
      if (occasion.includes('anniversary') && lyricsLower.includes('anniversary')) {
        console.log('   ✅ Occasion context: Anniversary theme present')
      } else if (occasion.includes('birthday') && lyricsLower.includes('birthday')) {
        console.log('   ✅ Occasion context: Birthday theme present')
      } else {
        console.log(`   ⚠️  Occasion context: ${occasion} not clearly reflected`)
      }
      
      // Check for vibe-appropriate language
      const vibe = scenario.data.vibe.toLowerCase()
      if (vibe === 'romantic' && (lyricsLower.includes('love') || lyricsLower.includes('heart'))) {
        console.log('   ✅ Vibe context: Romantic language detected')
      } else if (vibe === 'nostalgic' && (lyricsLower.includes('remember') || lyricsLower.includes('memories'))) {
        console.log('   ✅ Vibe context: Nostalgic language detected')
      } else if (vibe === 'energetic' && (lyricsLower.includes('energy') || lyricsLower.includes('alive'))) {
        console.log('   ✅ Vibe context: Energetic language detected')
      }
      
      console.log('\n📊 Results Summary:')
      console.log(`   Task ID: ${result.taskId || 'N/A'}`)
      console.log(`   Status: ${result.status || 'N/A'}`)
      console.log(`   Provider: ${result.provider || 'N/A'}`)
      console.log(`   Voice: ${result.voiceId || 'N/A'}`)
      
    } catch (error) {
      console.log('❌ Test failed:', error.message)
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n🎵 Enhanced Personalization Testing Complete!')
}

// Run the test
testEnhancedPersonalization().catch(console.error)