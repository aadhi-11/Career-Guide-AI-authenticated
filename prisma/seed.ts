import { PrismaClient, MessageRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.message.deleteMany()
  await prisma.chatSession.deleteMany()
  await prisma.user.deleteMany()

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Smith',
        email: 'bob.smith@email.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carol Davis',
        email: 'carol.davis@email.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create chat sessions for each user
  const chatSessions = []

  for (const user of users) {
    const sessions = await Promise.all([
      // Career exploration session
      prisma.chatSession.create({
        data: {
          userId: user.id,
          title: 'Exploring Software Engineering Career',
          lastMessage: 'What skills should I focus on for backend development?',
        },
      }),
      // Job search session
      prisma.chatSession.create({
        data: {
          userId: user.id,
          title: 'Job Search Strategy Discussion',
          lastMessage: 'How can I improve my resume for tech roles?',
        },
      }),
      // Interview preparation session
      prisma.chatSession.create({
        data: {
          userId: user.id,
          title: 'Technical Interview Prep',
          lastMessage: 'Can you help me practice system design questions?',
        },
      }),
    ])
    chatSessions.push(...sessions)
  }

  console.log(`✅ Created ${chatSessions.length} chat sessions`)

  // Create messages for each chat session
  const sampleConversations = [
    // Software Engineering Career Exploration
    [
      {
        role: MessageRole.USER,
        content: "I'm interested in becoming a software engineer but I'm not sure where to start. Can you help me understand the different paths available?",
      },
      {
        role: MessageRole.ASSISTANT,
        content: "Absolutely! Software engineering offers several exciting career paths. The main areas include:\n\n1. **Frontend Development** - Building user interfaces with React, Vue, or Angular\n2. **Backend Development** - Server-side logic, APIs, and databases\n3. **Full-Stack Development** - Both frontend and backend\n4. **DevOps/Cloud Engineering** - Infrastructure and deployment\n5. **Mobile Development** - iOS/Android apps\n6. **Data Engineering** - Data pipelines and analytics\n\nWhat type of work interests you most? Do you enjoy visual design, problem-solving, or working with data?",
      },
      {
        role: MessageRole.USER,
        content: "I'm more interested in backend development. What skills should I focus on?",
      },
      {
        role: MessageRole.ASSISTANT,
        content: "Great choice! Backend development is a solid career path. Here are the key skills to focus on:\n\n**Programming Languages:**\n- Python (Django/Flask) or JavaScript (Node.js)\n- Java (Spring Boot) or C# (.NET)\n- Go or Rust for high-performance systems\n\n**Databases:**\n- SQL databases (PostgreSQL, MySQL)\n- NoSQL databases (MongoDB, Redis)\n- Database design and optimization\n\n**Key Concepts:**\n- RESTful API design\n- Authentication and authorization\n- Microservices architecture\n- Cloud platforms (AWS, Azure, GCP)\n- Version control with Git\n\n**Recommended Learning Path:**\n1. Master one programming language\n2. Learn database fundamentals\n3. Build REST APIs\n4. Deploy to cloud platforms\n5. Learn containerization (Docker)\n\nWould you like me to suggest specific projects to practice these skills?",
      },
    ],
    // Job Search Strategy
    [
      {
        role: MessageRole.USER,
        content: "I've been applying to software engineering jobs but not getting many responses. How can I improve my resume and application strategy?",
      },
      {
        role: MessageRole.ASSISTANT,
        content: "Job searching in tech can be challenging, but there are several strategies to improve your success rate:\n\n**Resume Optimization:**\n- Use action verbs and quantify achievements\n- Include relevant keywords from job descriptions\n- Keep it concise (1-2 pages max)\n- Highlight projects and technologies used\n- Include links to your GitHub and portfolio\n\n**Application Strategy:**\n- Apply to 10-15 jobs per week consistently\n- Tailor each application to the specific role\n- Apply within 24-48 hours of job posting\n- Focus on companies that match your skill level\n\n**Networking:**\n- Attend local tech meetups and events\n- Connect with professionals on LinkedIn\n- Reach out to employees at target companies\n- Consider informational interviews\n\nWhat's your current experience level, and are you getting any interviews at all?",
      },
      {
        role: MessageRole.USER,
        content: "I'm a recent computer science graduate with some personal projects. I've had a few phone screens but no technical interviews yet. How can I improve my chances?",
      },
      {
        role: MessageRole.ASSISTANT,
        content: "That's actually a good sign - getting phone screens means your resume is working! Here's how to convert those into technical interviews:\n\n**For Phone Screens:**\n- Research the company and role thoroughly\n- Prepare 2-3 thoughtful questions about the team/tech stack\n- Practice explaining your projects clearly\n- Show enthusiasm and ask about growth opportunities\n\n**Portfolio Enhancement:**\n- Deploy your projects online (GitHub Pages, Vercel, Netlify)\n- Write detailed README files with setup instructions\n- Include live demos and screenshots\n- Add unit tests to show code quality awareness\n\n**Skill Building:**\n- Contribute to open source projects\n- Build a full-stack project with authentication\n- Practice coding problems daily (LeetCode, HackerRank)\n- Learn the tech stack of companies you're targeting\n\n**Follow-up Strategy:**\n- Send thank you emails after phone screens\n- Ask about next steps and timeline\n- Connect with interviewers on LinkedIn\n\nWould you like me to review one of your projects and suggest improvements?",
      },
    ],
    // Technical Interview Preparation
    [
      {
        role: MessageRole.USER,
        content: "I have a technical interview next week for a backend developer position. Can you help me prepare for system design questions?",
      },
      {
        role: MessageRole.ASSISTANT,
        content: "Absolutely! System design is crucial for backend roles. Let's start with the fundamentals:\n\n**Core Concepts to Master:**\n- **Scalability**: Horizontal vs vertical scaling\n- **Load Balancing**: Distributing traffic across servers\n- **Caching**: Redis, CDNs, application-level caching\n- **Databases**: SQL vs NoSQL, read replicas, sharding\n- **Microservices**: Service communication, API gateways\n- **Message Queues**: Asynchronous processing\n\n**Common System Design Questions:**\n1. Design a URL shortener (like bit.ly)\n2. Design a chat application\n3. Design a social media feed\n4. Design a file storage system\n5. Design a video streaming platform\n\n**Interview Strategy:**\n- Start with requirements clarification\n- Draw diagrams (use tools like draw.io)\n- Think out loud and explain your reasoning\n- Consider trade-offs and alternatives\n- Discuss monitoring and failure scenarios\n\nLet's practice with a simple one: How would you design a basic URL shortener?",
      },
      {
        role: MessageRole.USER,
        content: "For a URL shortener, I'd need a way to generate short codes and store the mapping. I'm thinking of using a hash function to create short URLs. Is that the right approach?",
      },
      {
        role: MessageRole.ASSISTANT,
        content: "Good start! Hash functions are one approach, but let me walk you through a more comprehensive design:\n\n**High-Level Architecture:**\n1. **API Service** - Handles short URL creation and redirection\n2. **Database** - Stores URL mappings (short_code -> original_url)\n3. **Cache Layer** - Redis for frequently accessed URLs\n4. **Load Balancer** - Distributes traffic\n\n**URL Generation Strategies:**\n- **Hash-based**: MD5/SHA256 (risk of collisions)\n- **Counter-based**: Auto-incrementing ID + base62 encoding\n- **Random string**: Generate random 6-8 character strings\n\n**Database Schema:**\n```sql\nurls (\n  id BIGINT PRIMARY KEY,\n  short_code VARCHAR(8) UNIQUE,\n  original_url TEXT,\n  created_at TIMESTAMP,\n  expires_at TIMESTAMP\n)\n```\n\n**Key Considerations:**\n- Handle collisions (retry with different code)\n- URL validation and sanitization\n- Rate limiting to prevent abuse\n- Analytics tracking (click counts)\n- Expiration policies\n\nWhat would you do to handle the scale of millions of URLs per day?",
      },
    ],
  ]

  // Create messages for each chat session
  let messageCount = 0
  for (let i = 0; i < chatSessions.length; i++) {
    const session = chatSessions[i]
    const conversationIndex = i % sampleConversations.length
    const conversation = sampleConversations[conversationIndex]

    for (const messageData of conversation) {
      await prisma.message.create({
        data: {
          chatSessionId: session.id,
          role: messageData.role,
          content: messageData.content,
        },
      })
      messageCount++
    }
  }

  console.log(`✅ Created ${messageCount} messages`)

  // Create some additional diverse conversations
  const additionalSessions = await Promise.all([
    prisma.chatSession.create({
      data: {
        userId: users[0].id,
        title: 'Career Transition from Marketing to Tech',
        lastMessage: 'What are the best ways to transition from marketing to a tech career?',
      },
    }),
    prisma.chatSession.create({
      data: {
        userId: users[1].id,
        title: 'Remote Work vs Office Work',
        lastMessage: 'What are the pros and cons of remote work in tech?',
      },
    }),
    prisma.chatSession.create({
      data: {
        userId: users[2].id,
        title: 'Salary Negotiation Tips',
        lastMessage: 'How should I approach salary negotiation for my first tech job?',
      },
    }),
  ])

  // Add messages to additional sessions
  const additionalConversations = [
    [
      {
        role: MessageRole.USER,
        content: "I've been working in marketing for 5 years but want to transition to tech. What's the best path forward?",
      },
      {
        role: MessageRole.ASSISTANT,
        content: "That's an exciting transition! Your marketing background actually gives you valuable skills for tech roles. Here are the most viable paths:\n\n**Product Management** - Your user research and market analysis skills translate well\n**Marketing Technology** - MarTech roles combine your marketing knowledge with technical skills\n**Data Analysis** - Marketing analytics experience is highly valuable\n**Technical Writing** - Documentation and content creation\n**Sales Engineering** - Technical sales roles\n\n**Recommended Steps:**\n1. Identify which path interests you most\n2. Take relevant online courses (Coursera, Udemy)\n3. Build projects in your chosen area\n4. Network with people in those roles\n5. Consider internal opportunities at your current company\n\nWhat type of work excites you most - building products, analyzing data, or something else?",
      },
    ],
    [
      {
        role: MessageRole.USER,
        content: "I'm considering whether to work remotely or in an office. What are the key differences for tech careers?",
      },
      {
        role: MessageRole.ASSISTANT,
        content: "Great question! Both have distinct advantages. Let me break down the key differences:\n\n**Remote Work Benefits:**\n- Better work-life balance and flexibility\n- No commute time and costs\n- Access to global job opportunities\n- Often higher salaries (especially in high-cost areas)\n- More focus time without office distractions\n\n**Office Work Benefits:**\n- Better collaboration and spontaneous discussions\n- Easier mentorship and learning opportunities\n- Stronger team relationships and company culture\n- Access to better equipment and infrastructure\n- Clearer work-life boundaries\n\n**For Tech Specifically:**\n- **Junior developers** often benefit from in-person mentorship\n- **Senior roles** can work effectively remotely\n- **Startups** may prefer in-person for rapid iteration\n- **Large companies** often offer hybrid options\n\n**My Recommendation:**\nStart with in-person or hybrid if you're early in your career, then transition to remote as you gain experience. What's your current experience level?",
      },
    ],
    [
      {
        role: MessageRole.USER,
        content: "I just got a job offer for my first tech position! The salary is $75k. How should I approach negotiation?",
      },
      {
        role: MessageRole.ASSISTANT,
        content: "Congratulations on the offer! $75k is a solid starting salary, but there's often room for negotiation. Here's how to approach it professionally:\n\n**Research First:**\n- Check Glassdoor, Levels.fyi, and LinkedIn for similar roles in your area\n- Consider the total compensation package (benefits, equity, PTO)\n- Factor in your specific skills and any relevant experience\n\n**Negotiation Strategy:**\n- Express enthusiasm for the role first\n- Present data-backed reasoning for your request\n- Be specific: 'Based on my research, similar roles in this area range from $80-85k'\n- Consider negotiating other benefits if salary is firm\n\n**What to Negotiate:**\n- Base salary (aim for 10-15% increase)\n- Signing bonus\n- Additional vacation days\n- Flexible work arrangements\n- Professional development budget\n- Earlier performance review\n\n**Sample Script:**\n'I'm excited about this opportunity and believe I can add significant value. Based on my research and the skills I bring, I was hoping we could discuss a salary in the $80-82k range. Is there flexibility in the budget?'\n\nWhat's the role and location? I can help you research more specific salary ranges.",
      },
    ],
  ]

  for (let i = 0; i < additionalSessions.length; i++) {
    const session = additionalSessions[i]
    const conversation = additionalConversations[i]

    for (const messageData of conversation) {
      await prisma.message.create({
        data: {
          chatSessionId: session.id,
          role: messageData.role,
          content: messageData.content,
        },
      })
      messageCount++
    }
  }

  console.log(`✅ Created ${messageCount} total messages`)
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
