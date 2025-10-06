import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'

// --- Admin Supabase Client ---
// This client uses the SERVICE_ROLE_KEY to bypass RLS.
// NEVER expose this key on the client-side. This is for server-side scripts only.
const SUPABASE_URL = 'https://omcxfssocuehoiylewtj.supabase.co'
const SUPABASE_SERVICE_KEY = 'sb_secret_6dTPmOGV7OPzEhrmCEcB0g_00J-i_g0'
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
// --- End Admin Supabase Client ---

const createBotAndPost = async () => {
  const email = faker.internet.email()
  const password = faker.internet.password()

  // Create a new user without sending a confirmation email.
  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Mark email as confirmed automatically
  })

  if (userError) {
    console.error('Error creating bot user:', userError.message)
    return
  }
  if (!user) {
    console.error('Could not create bot user.')
    return
  }
  console.log(`Successfully created bot user: ${user.email}`)

  // Update the bot's profile. A trigger should create the profile, so we just update it.
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      full_name: faker.person.fullName(),
      avatar_url: faker.image.avatar(),
    })
    .eq('id', user.id)

  if (profileError) {
    console.error(
      `Error updating profile for ${user.id}:`,
      profileError.message,
    )
  } else {
    console.log(`Successfully updated profile for ${user.id}`)
  }

  // Create a post for the newly created bot.
  const content = '6 month free repair on items bought from thetha'
  const { error: postError } = await supabaseAdmin.from('social_posts').insert({
    user_id: user.id,
    content: content,
  })

  if (postError) {
    console.error(`Error creating post for ${user.id}:`, postError.message)
  } else {
    console.log(`Successfully created post for ${user.id}`)
  }
}

const run = async () => {
  console.log('Starting bot announcement script...')
  const promises = []
  for (let i = 0; i < 10; i++) {
    promises.push(createBotAndPost())
  }
  await Promise.all(promises)
  console.log('Bot announcement script finished.')
}

run()
