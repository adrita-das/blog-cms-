A full-stack blog content management website where users can sign up, write stories, save drafts, publish posts, and read what the community has written. It also includes an admin panel for managing posts and users.
 
**Live demo:** https://exquisite-pika-2f9841.netlify.app/
 

 
## Features
 
**Writers**
- Sign up, sign in, and reset a forgotten password by email
- Write posts with a title, content, and an optional cover image
- Save as draft or publish
- Edit and delete your own stories
- "My Stories" page with Draft and Published tabs
**Readers**
- Public feed of all published posts
- Author shown as `@username`
- Reading time and "time ago" on every post
**Admin**
- Role-based access to a separate admin panel
- Dashboard stats: total posts, published, drafts, users
- Filter posts by status, publish or unpublish a post, delete a post
- Users list with roles and join dates
## Tech stack
 
| Area | Tool |
|------|------|
| Frontend | HTML, vanilla JavaScript (ES modules) |
| Styling | Tailwind CSS, Font Awesome |
| Build tool | Vite (multi-page build) |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| Security | JWT sessions, Row Level Security |
| Hosting | Netlify, auto-deployed from GitHub |
 
## How it works
 
**Authentication (JWT).** Users sign in through Supabase Auth, which issues a JWT session. The app reads that session to know who is logged in and to protect pages. The same token identifies the user to the database, so Row Level Security policies decide who can read, edit, or delete each post.
 
**Cover images (Supabase Storage).** Cover images are uploaded to a public Supabase Storage bucket, organised in a folder per user. The image's public URL is saved with the post and shown in the feed and editor.
 
**Drafts and publishing.** Every post has a status of `draft` or `published`. Drafts are private to their author, while published posts appear in the public feed.
 
**Password reset.** A user requests a reset link by email. The link brings them back to the sign-in page, which detects the recovery session and shows a "Set a New Password" form. After the update, they are signed out and sent back to Sign In.
 
**Admin panel.** The admin page checks the user's role before loading. Admins can see every post and user, change a post's status, and delete posts.
 
## Project structure
 
```
blog_cms/
├── index.html            # Landing page
├── auth.html             # Sign in / Sign up / Forgot password / Set new password
├── profile.html          # Public feed of published posts
├── post.html             # Create and edit a post
├── stories.html          # Your drafts and published stories
├── read.html             # Read a post
├── admin.html            # Admin panel
├── vite.config.js        # Multi-page build config
└── src/
    ├── supabase-config.js   # Supabase client + auth, posts, and storage helpers
    ├── utils.js             # Shared helpers (timeAgo, readingTime, avatar colors)
    ├── auth.js              # Sign in / Sign up logic
    ├── reset-password.js    # Forgot password + set new password flow
    ├── profile.js           # Feed page logic
    ├── post.js              # Editor logic (create, edit, upload cover)
    ├── stories.js           # My Stories page logic
    ├── read.js              # Read page logic
    ├── admin.js             # Admin panel logic
    └── tailwind.css
```
 
## Deployment
 
The site is hosted on Netlify and connected to this GitHub repository. Every push to `main` triggers a new build (`npm run build`) and publishes the `dist` folder.
 
## What I learned
 
- Building a multi-page app with Vite and configuring every page in the production build
- Using Supabase Auth, JWT sessions, and Row Level Security to protect data
- Handling file uploads with Supabase Storage
- Debugging a real deployment issue where password reset links pointed to the wrong site
- Moving repeated code into a shared `utils.js` file
## Author
 
**Adrita Das**
GitHub: [@adrita-das](https://github.com/adrita-das)
