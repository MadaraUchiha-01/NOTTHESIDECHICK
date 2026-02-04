'use server'

import { generateText } from 'ai'

export async function generatePoetry(particleCount: number): Promise<string> {
  try {
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `You are a cosmic poet who creates short, mystical descriptions of particle explosions and cosmic phenomena. 
Your poetry should be ethereal, mysterious, and no more than 2-3 sentences. 
Use imagery of space, stars, and cosmic forces. 
Keep it poetic but concise.`,
      prompt: `Generate a poetic description of a particle explosion with ${particleCount} particles bursting into the void. Make it mystical and brief.`,
      maxTokens: 150,
    })

    return (
      result.text ||
      'The cosmos dances in silence, each particle a story untold...'
    )
  } catch (error) {
    console.error('Poetry generation error:', error)
    return 'Stars collide in the infinite void, their light echoing through eternity...'
  }
}
