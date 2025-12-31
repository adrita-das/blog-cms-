setInterval(async () => {
  // Ping your database every 6 days to keep it active
  const { data } = await supabase.from('posts').select('id').limit(1);
  console.log('Keep-alive ping sent');
}, 6 * 24 * 60 * 60 * 1000); // Every 6 days