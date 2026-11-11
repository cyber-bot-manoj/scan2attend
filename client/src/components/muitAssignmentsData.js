// Official MUIT Student Coursework & Assignments Database (BCA Semester V)
// Exact match with Maharishi University of Information Technology Coursework

export const MUIT_ASSIGNMENTS = [
  {
    sNo: 1,
    code: 'BCA501',
    subject: 'COMPUTER GRAPHICS',
    fileName: 'Computer Graphics Assignment 1 - Copy.docx',
    fileType: 'docx',
    uploadedFile: null,
    topic: 'Cathode Ray Tubes, Raster Scan vs Vector Displays & Frame Buffer Sizing',
    questions: [
      'Explain the construction and working principle of a CRT monitor with a labeled diagram.',
      'Differentiate between Raster Scan and Vector (Random) Scan displays on resolution, refresh rate, and beam deflection.',
      'Calculate the total frame buffer memory in MB needed for a 1920x1080 resolution display with 24-bit RGB true color depth.',
      'What is aspect ratio? Determine the screen height if aspect ratio is 16:9 and width is 1280 pixels.'
    ]
  },
  {
    sNo: 2,
    code: 'BCA502',
    subject: 'CRYPTOGRAPHY AND NETWORK SECURITY',
    fileName: 'Cryptography & Network Security Assignment 1.docx',
    fileType: 'docx',
    uploadedFile: null,
    topic: 'Classical Encryption Techniques & Substitution Ciphers',
    questions: [
      'Define Cryptography, Cryptanalysis, and Cryptology. State the fundamental principles of the CIA triad.',
      'Explain Playfair Cipher with an example. Encrypt the keyword "MONARCHY" and plaintext "BALLOON".',
      'Explain the working of Hill Cipher with 2x2 matrix encryption and modular multiplicative inverse.',
      'Differentiate between Stream Ciphers and Block Ciphers with practical examples.'
    ]
  },
  {
    sNo: 3,
    code: 'BCA502',
    subject: 'CRYPTOGRAPHY AND NETWORK SECURITY',
    fileName: 'Cryptography_Assignment 1.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Feistel Cipher Architecture & DES Algorithm',
    questions: [
      'Explain the Feistel Cipher structure in detail. What are the design principles of the round function?',
      'Outline the complete 16-round key generation process in DES (Data Encryption Standard).',
      'Discuss the Avalanche Effect in block ciphers and demonstrate its significance in DES.',
      'What is Triple DES (3DES)? Why is the EDE (Encrypt-Decrypt-Encrypt) scheme preferred over EEE?'
    ]
  },
  {
    sNo: 4,
    code: 'BCA501',
    subject: 'COMPUTER GRAPHICS',
    fileName: 'BCA_V_Sem_Computer_Graphics_Assignment_1.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Line Drawing Algorithms: DDA & Bresenham Line Generation',
    questions: [
      'Derive the digital differential analyzer (DDA) line algorithm for |m| <= 1 and |m| > 1.',
      'Derive Bresenham’s Line Algorithm with initial decision parameter calculation.',
      'Using Bresenham’s algorithm, rasterize the line with endpoints (2, 3) and (10, 8). Tabulate all intermediate (x, y) coordinates and decision parameter p.',
      'Compare DDA and Bresenham line drawing algorithms in terms of computational speed and floating-point arithmetic.'
    ]
  },
  {
    sNo: 5,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'Assignment 1 WT.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Semantic HTML5 Elements & CSS3 Box Model',
    questions: [
      'Explain the structure of an HTML5 document and explain 6 semantic tags introduced in HTML5.',
      'Detail the CSS Box Model with margins, borders, padding, and content areas with a diagram.',
      'Explain CSS Flexbox layout properties: justify-content, align-items, flex-direction, and flex-wrap.',
      'Build a responsive 3-column navigation bar using CSS Media Queries for viewport widths below 768px.'
    ]
  },
  {
    sNo: 6,
    code: 'BCA504',
    subject: 'MINOR PROJECT',
    fileName: 'Minor Project Guidelines for Students.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'BCA Capstone Minor Project Regulations & Milestone Schedule',
    questions: [
      'Review Phase 1: Problem Definition, Literature Survey, and Scope Statement.',
      'Review Phase 2: Software Requirements Specification (SRS) following IEEE 830 standards.',
      'Review Phase 3: System Design, ER Diagrams, UML Sequence, and Data Flow Diagrams (DFD Level 0-2).',
      'Submission Deadlines: Synopsis approval (Week 3), Mid-term evaluation (Week 8), Final project defense (Week 14).'
    ]
  },
  {
    sNo: 7,
    code: 'BCA504',
    subject: 'MINOR PROJECT',
    fileName: 'Minor Project topic apporval form.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Project Topic Approval & Mentor Allocation Application Form',
    questions: [
      'Student Particulars: Name, University Roll Number, Semester, and Section.',
      'Proposed Project Title and Problem Statement domain (e.g. AI/ML, Cloud Computing, IoT, Full-Stack Web).',
      'Technology Stack Proposed: Frontend, Backend API, Database, and Deployment Infrastructure.',
      'Signatures: Student Undertaking, Faculty Mentor Endorsement, and Head of Department Approval.'
    ]
  },
  {
    sNo: 8,
    code: 'BCA504',
    subject: 'MINOR PROJECT',
    fileName: 'Minor Project Topics an Faculty Guide list.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Approved Domain Topics and Faculty Guide Roster',
    questions: [
      'Domain 1: Smart Attendance with Geofencing & Biometrics (Guide: Dr. Peeyush Pathak).',
      'Domain 2: E-Learning Management Platform with Real-time Proctoring (Guide: Mr. Rishi Mohan Awasthi).',
      'Domain 3: Cryptographic Digital Certificate Verification on Distributed Ledger (Guide: Dr. Gouri Shukla).',
      'Domain 4: OpenGL Real-time 3D Simulation Engine (Guide: Mr. Dhananjay Kr. Yadav).'
    ]
  },
  {
    sNo: 9,
    code: 'BCA504',
    subject: 'MINOR PROJECT',
    fileName: 'Minor Project Topics an Faculty Guide list.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Faculty Allocation Matrix & Weekly Review Schedule',
    questions: [
      'Guide Allocation by Roll Numbers: Batch V-B (2401031601001 to 2401031601150).',
      'Schedule of Weekly Progress Review Meetings every Tuesday 02:35 PM to 03:25 PM.',
      'Logbook Maintenance Criteria: Weekly signatures required from designated guide.',
      'Evaluation rubric: Synopsis (20%), Mid-Term (30%), Final Demo & Viva (50%).'
    ]
  },
  {
    sNo: 10,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'ASSIGNMENT 1 - BCSA503 - WebTech.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'JavaScript Fundamentals, ES6 Syntax & DOM Manipulation',
    questions: [
      'Explain the JavaScript Event Loop, Call Stack, Task Queue, and Microtask Queue.',
      'Differentiate between var, let, and const with scope, reassignment, and hoisting examples.',
      'Write JavaScript code to validate a registration form with email, password strength, and mobile regex.',
      'Demonstrate promises, async/await, and fetch API with error handling try-catch blocks.'
    ]
  },
  {
    sNo: 11,
    code: 'BCA512',
    subject: 'WEB TECHNOLOGY LAB',
    fileName: 'ASSIGNMENT 1 - BCSA512 - WebTech_lab.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Practical Lab 1: Responsive Layout with HTML5/CSS3 Flexbox and Grid',
    questions: [
      'Create an institutional landing page featuring header, responsive navbar, hero banner, course card grid, and footer.',
      'Implement a responsive contact form with floating label inputs and live validation states.',
      'Use CSS CSS Grid auto-fit and minmax(280px, 1fr) for card reorganization across mobile and desktop.'
    ]
  },
  {
    sNo: 12,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'ASSIGNMENT 2 - BCA503 - WebTech.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Node.js Architecture & Express.js Routing',
    questions: [
      'Explain the non-blocking asynchronous architecture of Node.js and the libuv event loop.',
      'Build an Express.js server with RESTful endpoints: GET, POST, PUT, DELETE for student records.',
      'Explain custom middleware functions in Express: application-level, router-level, and error-handling middleware.',
      'Implement CORS and express.json() body parsing with practical example code.'
    ]
  },
  {
    sNo: 13,
    code: 'BCA502',
    subject: 'CRYPTOGRAPHY AND NETWORK SECURITY',
    fileName: 'BCA503_CNS_ASSIGNMENT_1.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Advanced Encryption Standard (AES) & S-Box Generation',
    questions: [
      'Explain the complete AES cipher structure with SubBytes, ShiftRows, MixColumns, and AddRoundKey.',
      'How is the S-Box constructed in AES using multiplicative inverse in GF(2^8) followed by affine transformation?',
      'Calculate the number of rounds for AES-128, AES-192, and AES-256 with key schedules.',
      'Compare AES and DES in terms of block size, security vulnerabilities, and hardware implementation efficiency.'
    ]
  },
  {
    sNo: 14,
    code: 'BCA502',
    subject: 'CRYPTOGRAPHY AND NETWORK SECURITY',
    fileName: 'BCA503_CNS_ASSIGNMENT_2.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Public Key Cryptography & RSA Algorithm Proofs',
    questions: [
      'State Euler’s Totient Function phi(n). Compute phi(35) and phi(77).',
      'Explain the RSA algorithm. Generate keys using p=61, q=53, e=17. Encrypt M=65 and decrypt ciphertext C.',
      'Explain the mathematical security basis of RSA: Integer Factorization Problem.',
      'Explain Diffie-Hellman Key Exchange and demonstrate vulnerability to Man-in-the-Middle attack without digital signatures.'
    ]
  },
  {
    sNo: 15,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: '_web technology assignment (unit 1).pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Unit 1: Internet Architecture, HTTP Protocols & DNS Resolution',
    questions: [
      'Explain the 7 layers of the OSI model and compare it with the TCP/IP stack.',
      'Describe the complete lifecycle of a URL request in a browser from DNS query to TCP 3-way handshake to rendering.',
      'Compare HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC protocol over UDP).',
      'What are HTTP request methods, status codes (2xx, 3xx, 4xx, 5xx), and header fields?'
    ]
  },
  {
    sNo: 16,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WEBTECHNOLOGY-ASSIGNMENT 2.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Client-Side Storage, Cookies, Web Storage API & IndexedDB',
    questions: [
      'Compare Cookies, localStorage, and sessionStorage on storage capacity, expiration, and transmission in HTTP requests.',
      'Explain Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF). How do HttpOnly and SameSite cookie flags protect sessions?',
      'Implement an authenticated token storage mechanism with auto-refresh upon expiry.',
      'What is IndexedDB? Write sample code to open an object store and store student record objects.'
    ]
  },
  {
    sNo: 17,
    code: 'BCA512',
    subject: 'WEB TECHNOLOGY LAB',
    fileName: 'Web Technology LAB ASSIGNMENT.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Practical Lab 2: Interactive DOM Manipulation with JavaScript',
    questions: [
      'Build a dynamic To-Do / Task Management App with Add, Edit, Delete, Filter, and local storage persistence.',
      'Implement live form validation with custom error tooltips for Email, Phone number, and Password confirmation.',
      'Create an image carousel with automatic timer transitions, Next/Prev controls, and dot indicators.'
    ]
  },
  {
    sNo: 18,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'ASSIGNMENT 1 - BCA-503 - Web Technology.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Full-Stack REST Architecture with MongoDB Mongoose',
    questions: [
      'Explain NoSQL databases vs Relational DBMS. Why is MongoDB suitable for JSON document structures?',
      'Write Mongoose schema definition with pre-save hooks for password hashing with bcrypt.',
      'Write Express controller functions to perform CRUD operations on a "CourseEnrollment" collection.',
      'Demonstrate MongoDB aggregation pipeline with $match, $group, and $project stages.'
    ]
  },
  {
    sNo: 19,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'ASSIGNMENT 2- BCA-503 - Web Technology.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'JSON Web Tokens (JWT) & Role-Based Access Control',
    questions: [
      'Explain the anatomy of a JSON Web Token: Header, Payload, and Signature.',
      'Write Express middleware to verify JWT from Bearer Authorization header and inject authenticated user into req.user.',
      'Implement Role-Based Access Control (RBAC) middleware verifying roles ("STUDENT", "FACULTY", "ADMIN").',
      'Explain Token Revocation strategies: Blacklist, Redis store, and Refresh Token Rotation.'
    ]
  },
  {
    sNo: 20,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'ASSIGNMENT 3 - BCA-503 - Web Technology.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'React.js Component Architecture, Hooks & State Management',
    questions: [
      'Explain the React Virtual DOM reconciliation algorithm and diffing heuristics.',
      'Compare useState, useEffect, useRef, and useMemo with practical code demonstrations.',
      'How does Context API provide global state management across nested components without prop drilling?',
      'Build a reusable Modal component with backdrop blur and portal rendering into document.body.'
    ]
  },
  {
    sNo: 21,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'ASSIGNMENT 4 - BCA-503 - Web Technology.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'WebSockets & Real-Time Full-Duplex Communication',
    questions: [
      'Differentiate between HTTP Polling, Long-Polling, Server-Sent Events (SSE), and WebSockets.',
      'Implement a real-time classroom broadcast server using Node.js and Socket.IO.',
      'Handle connection, disconnection, room joining, and broadcast events on both server and client.',
      'Explain heartbeat ping-pong mechanisms to maintain persistent WebSocket connections.'
    ]
  },
  {
    sNo: 22,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'ASSIGNMENT 5 - BCA-503 - Web Technology.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Web Application Security: OWASP Top 10 Defenses',
    questions: [
      'Detail the OWASP Top 10 vulnerabilities (Injection, Broken Authentication, Sensitive Data Exposure).',
      'How do parameterized queries prevent SQL Injection in relational databases?',
      'Explain Content Security Policy (CSP) headers and how to configure them in Express with Helmet.js.',
      'Implement rate limiting on sensitive API endpoints using express-rate-limit.'
    ]
  },
  {
    sNo: 23,
    code: 'BCA512',
    subject: 'WEB TECHNOLOGY LAB',
    fileName: 'Assignment-1 Exp-1 -3 Web Technology Lab - BCA-512.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Lab Experiments 1-3: Core Front-End Architecture & CSS Animations',
    questions: [
      'Experiment 1: Design a multi-page college department portal using semantic HTML5 and external stylesheet.',
      'Experiment 2: Implement a responsive pricing table with CSS transitions and 3D hover transform effects.',
      'Experiment 3: Create an animated progress indicator with CSS keyframes.'
    ]
  },
  {
    sNo: 24,
    code: 'BCA512',
    subject: 'WEB TECHNOLOGY LAB',
    fileName: 'Assignment-2 Exp-4 -6 Web Technology Lab - BCA-512.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Lab Experiments 4-6: Asynchronous JavaScript & REST API Integration',
    questions: [
      'Experiment 4: Fetch live JSON weather data from a public API and display temperature, humidity, and condition icon.',
      'Experiment 5: Implement debounced search autocomplete for a student directory.',
      'Experiment 6: Build a drag-and-drop file uploader with live upload progress percentage bar.'
    ]
  },
  {
    sNo: 25,
    code: 'BCA512',
    subject: 'WEB TECHNOLOGY LAB',
    fileName: 'Assignment-3 Exp-6 -9 Web Technology Lab - BCA-512.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Lab Experiments 7-9: Backend API Development with Express & MongoDB',
    questions: [
      'Experiment 7: Build Node.js backend with Express routing for a Bookstore management application.',
      'Experiment 8: Connect Express app to MongoDB Atlas and execute queries with pagination and sorting.',
      'Experiment 9: Secure endpoints with JWT middleware and test with Postman.'
    ]
  },
  {
    sNo: 26,
    code: 'BCA512',
    subject: 'WEB TECHNOLOGY LAB',
    fileName: 'Assignment-4 Exp-9-12 Web Technology Lab - BCA-512.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Lab Experiments 10-12: Full Stack Deployment & Cloud Hosting',
    questions: [
      'Experiment 10: Dockerize a MERN stack application with multi-stage Dockerfile.',
      'Experiment 11: Configure environment variables and deploy frontend on Vercel and backend on Render/Railway.',
      'Experiment 12: Set up automated CI/CD pipeline using GitHub Actions to run test suites upon git push.'
    ]
  },
  {
    sNo: 27,
    code: 'BCA511',
    subject: 'COMPUTER GRAPHICS LAB',
    fileName: 'CG Lab Assignment.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Practical Lab 1: Graphic Primitives in C/OpenGL',
    questions: [
      'Write a C/C++ program to initialize graphics mode using initgraph() and draw primitive shapes: line, circle, arc, ellipse, rectangle.',
      'Implement Midpoint Circle Generation algorithm in C graphics.',
      'Plot concentric circles with alternating color fills using flood fill and boundary fill algorithms.'
    ]
  },
  {
    sNo: 28,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WebTechnology -ASSIGNMENT 3.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Single Page Application (SPA) Routing & State Management',
    questions: [
      'Explain React Router v6 architecture: BrowserRouter, Routes, Route, Link, and useNavigate.',
      'How to implement protected routes in React checking authentication status before rendering child components?',
      'Explain code-splitting and lazy loading in React using React.lazy() and Suspense.',
      'Demonstrate form management with controlled components vs uncontrolled components with useRef.'
    ]
  },
  {
    sNo: 29,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WEB TECH Assignment 1.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Document Object Model (DOM) Tree & Event Delegation',
    questions: [
      'Explain the DOM Tree hierarchy and methods to select elements: getElementById, querySelector, querySelectorAll.',
      'What is Event Bubbling and Event Capturing? Explain event.stopPropagation() and event.preventDefault().',
      'Explain Event Delegation and why it is memory efficient for dynamic lists with thousands of items.',
      'Write code to dynamically create, append, and remove elements in an HTML table using JavaScript.'
    ]
  },
  {
    sNo: 30,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'Web Technology Assignment 2.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'CSS Preprocessors (SASS/SCSS) & Modern Tailwind CSS Utilities',
    questions: [
      'What are CSS Preprocessors? Explain SCSS features: variables, nesting, mixins, and inheritance (@extend).',
      'Compare utility-first CSS (Tailwind CSS) with component-based CSS frameworks (Bootstrap).',
      'Explain how Tailwind CSS JIT (Just-In-Time) compiler purges unused styles to produce a lightweight production bundle.',
      'Implement dark-mode switching using CSS custom properties (variables) and localStorage persistence.'
    ]
  },
  {
    sNo: 31,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'Web Technology ASSIGNMENT 3 (1).pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Microservices vs Monolith Web Architecture & API Gateway',
    questions: [
      'Compare Monolithic architecture with Microservices architecture in web applications.',
      'What is an API Gateway? Explain its responsibilities: reverse proxy, authentication, rate limiting, and request routing.',
      'Explain containerization with Docker and container orchestration with Docker Compose.',
      'Design a microservices architecture for a Student Attendance & Examination ERP.'
    ]
  },
  {
    sNo: 32,
    code: 'BCA501',
    subject: 'COMPUTER GRAPHICS',
    fileName: 'Assignment 1_CG_Ankit Khare.docx',
    fileType: 'docx',
    uploadedFile: null,
    topic: 'Graphic Input/Output Devices & Display Processors (Faculty: Mr. Ankit Khare)',
    questions: [
      'Explain the architecture and functional block diagram of a Display Processor.',
      'Discuss input devices for computer graphics: digitizers, light pens, joy sticks, trackballs, and data gloves.',
      'Explain Shadow Mask CRT vs Beam Penetration CRT for color generation.',
      'What are Flat Panel Displays? Explain Liquid Crystal Display (LCD) and OLED technologies.'
    ]
  },
  {
    sNo: 33,
    code: 'BCA501',
    subject: 'COMPUTER GRAPHICS',
    fileName: 'Assignment 2_CG_Ankit Khare.docx',
    fileType: 'docx',
    uploadedFile: null,
    topic: 'Circle & Ellipse Generating Algorithms (Faculty: Mr. Ankit Khare)',
    questions: [
      'Derive the Midpoint Circle Algorithm using 8-way circle symmetry.',
      'Calculate pixel coordinates for a circle of radius r = 10 centered at (0, 0) using Midpoint algorithm.',
      'Derive the Midpoint Ellipse Algorithm for region 1 and region 2 using 4-way symmetry.',
      'Explain Anti-Aliasing techniques: Super-sampling, area sampling, and filtering.'
    ]
  },
  {
    sNo: 34,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'web technology assignment_1.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Front-End Tooling: Vite, Webpack, Babel & NPM Package Ecosystem',
    questions: [
      'Explain how Vite utilizes native ES modules in development to provide instant Hot Module Replacement (HMR).',
      'Compare Vite vs Webpack on build time, configuration complexity, and production bundling.',
      'What is Babel and why is transpilation necessary for cross-browser ECMAScript compatibility?',
      'Explain package.json vs package-lock.json and semantic versioning (caret ^ vs tilde ~).'
    ]
  },
  {
    sNo: 35,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'BCA-WEBTECHNOLOGY-ASSIGNMENT 2.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Stateful vs Stateless Protocols, Session Management & Redis',
    questions: [
      'Why is HTTP termed a stateless protocol? How is session state preserved across requests?',
      'Explain Session IDs stored in Server Memory vs Distributed In-Memory caching with Redis.',
      'Discuss horizontal scaling challenges when using sticky sessions vs stateless JWT authentication.',
      'Write sample code to implement distributed session caching using express-session and connect-redis.'
    ]
  },
  {
    sNo: 36,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WebTechnology -ASSIGNMENT 3.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Progressive Web Apps (PWA) & Service Workers',
    questions: [
      'What is a Progressive Web App (PWA)? Detail the 3 pillars: Capable, Reliable, and Installable.',
      'Explain Service Worker lifecycle: Register, Install, Activate, and Fetch.',
      'Describe caching strategies: Cache First, Network First, Stale While Revalidate, and Network Only.',
      'Write a sample manifest.json file configuring application icons, standalone display, and theme colors.'
    ]
  },
  {
    sNo: 37,
    code: 'BCA511',
    subject: 'COMPUTER GRAPHICS LAB',
    fileName: 'Graphics Lab Assignment List.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Lab Practical Experiments Curriculum & Lab Manual Guidelines',
    questions: [
      'Experiment 1: Implementation of DDA Line Drawing Algorithm in C/C++.',
      'Experiment 2: Implementation of Bresenham Line Drawing Algorithm.',
      'Experiment 3: Implementation of Midpoint Circle Generation Algorithm.',
      'Experiment 4: Implementation of Midpoint Ellipse Algorithm.',
      'Experiment 5: 2D Transformations: Translation, Scaling, and Rotation.',
      'Experiment 6: Cohen-Sutherland Line Clipping Algorithm.'
    ]
  },
  {
    sNo: 38,
    code: 'BCA511',
    subject: 'COMPUTER GRAPHICS LAB',
    fileName: 'BCA511_CG_Lab_Assignment_1.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Practical Lab 2: 2D Composite Transformations in C',
    questions: [
      'Implement 2D Translation of a polygon by translation vector (tx, ty).',
      'Implement 2D Scaling with respect to origin and arbitrary fixed point (xf, yf).',
      'Implement 2D Rotation by angle theta in counterclockwise direction around a pivot point (xr, yr).',
      'Demonstrate matrix multiplication for composite transformations using homogeneous coordinates.'
    ]
  },
  {
    sNo: 39,
    code: 'BCA501',
    subject: 'COMPUTER GRAPHICS',
    fileName: 'ASSIGNMENT 2 - BCA501 Computer Graphics.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: '2D Geometric Transformations & Homogeneous Coordinates',
    questions: [
      'Explain why 2D points are represented in 3x3 Homogeneous Coordinates matrix form.',
      'Derive the composite transformation matrix for rotating an object about an arbitrary point P(xr, yr).',
      'Explain Reflection transformations with respect to X-axis, Y-axis, origin, and the line y = x.',
      'What is Shearing? Differentiate between X-direction shear and Y-direction shear with matrix representations.'
    ]
  },
  {
    sNo: 40,
    code: 'BCA501',
    subject: 'COMPUTER GRAPHICS',
    fileName: 'ASSIGNMENT 3 - BCA501 Computer Graphics.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: '2D Viewing Pipeline & Cohen-Sutherland Line Clipping',
    questions: [
      'Explain the 2D Viewing Pipeline: World Coordinates -> Viewing Coordinates -> Normalized Coordinates -> Device Coordinates.',
      'Explain Cohen-Sutherland Line Clipping Algorithm. How are 4-bit region OutCodes assigned (Top, Bottom, Right, Left)?',
      'A clipping window has corners (10, 10) and (50, 50). Clip the line from P1(0, 20) to P2(60, 40) using Cohen-Sutherland.',
      'Explain Sutherland-Hodgman Polygon Clipping algorithm against convex clipping windows.'
    ]
  },
  {
    sNo: 41,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WebTechnology -ASSIGNMENT 4 (2).pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'GraphQL API vs REST API & Query Optimization',
    questions: [
      'Compare REST API design with GraphQL on over-fetching, under-fetching, and endpoint explosion.',
      'Explain GraphQL Schema Definition Language (SDL): Queries, Mutations, and Subscriptions.',
      'What is the N+1 problem in GraphQL and how does DataLoader solve it with batching and caching?',
      'Build a sample Apollo Server schema and resolver for student gradebook queries.'
    ]
  },
  {
    sNo: 42,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WebTechnology -ASSIGNMENT 5 (1).pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Serverless Functions, Edge Computing & Cloud Services',
    questions: [
      'Explain Serverless computing architecture (FaaS - Function as a Service).',
      'Compare traditional VM/container hosting with Serverless execution (cold starts vs warm instances).',
      'What is Edge Computing? How do Edge Functions execute code close to the user in CDN points of presence?',
      'Write a serverless handler function processing an attendance QR code generation request.'
    ]
  },
  {
    sNo: 43,
    code: 'BCA502',
    subject: 'CRYPTOGRAPHY AND NETWORK SECURITY',
    fileName: 'CNS_assignment2.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Cryptographic Hash Functions: SHA-256 & Message Authentication Codes (MAC)',
    questions: [
      'State the 3 core security requirements of cryptographic hash functions: Preimage resistance, Second preimage resistance, and Collision resistance.',
      'Explain the Merkle-Damgard construction and detail SHA-256 round compression function.',
      'Explain HMAC (Keyed-Hash Message Authentication Code). Why is HMAC(K, M) = H((K+ XOR opad) || H((K+ XOR ipad) || M))?',
      'How does Birthday Paradox relate to collision attacks on hash functions of bit length n?'
    ]
  },
  {
    sNo: 44,
    code: 'BCA502',
    subject: 'CRYPTOGRAPHY AND NETWORK SECURITY',
    fileName: 'CNS_assignment3.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Digital Signatures, Digital Certificates & Public Key Infrastructure (PKI)',
    questions: [
      'Explain the Digital Signature generation and verification process using asymmetric cryptography.',
      'What is Digital Signature Algorithm (DSA)? Explain its mathematical foundation based on discrete logarithms.',
      'Describe X.509 Digital Certificate structure: Version, Serial Number, Issuer, Validity Period, Subject, Subject Public Key.',
      'Explain the Certificate Authority (CA) hierarchical chain of trust and Certificate Revocation Lists (CRL).'
    ]
  },
  {
    sNo: 45,
    code: 'BCA501',
    subject: 'COMPUTER GRAPHICS',
    fileName: 'Assignment 3_CG_Ankit Khare.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: '3D Geometric Transformations & Projections (Faculty: Mr. Ankit Khare)',
    questions: [
      'Formulate 3D Translation, Scaling, and Rotation matrices in 4x4 Homogeneous Coordinates.',
      'Differentiate between Parallel Projections (Orthographic, Axonometric, Oblique) and Perspective Projections.',
      'Derive the Perspective Transformation matrix with center of projection at the origin.',
      'What is vanishing point? Explain 1-point, 2-point, and 3-point perspective projections.'
    ]
  },
  {
    sNo: 46,
    code: 'BCA501',
    subject: 'COMPUTER GRAPHICS',
    fileName: 'Assignment 4_CG_Ankit Khare.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Visible Surface Detection Algorithms (Faculty: Mr. Ankit Khare)',
    questions: [
      'Explain the Z-Buffer (Depth-Buffer) algorithm for hidden surface removal with pseudocode.',
      'Compare Object-Space algorithms vs Image-Space algorithms for visible surface detection.',
      'Explain the A-Buffer algorithm and how it handles transparency and anti-aliasing.',
      'Describe Painter’s Algorithm (Depth-Sort) and how cyclic overlap ambiguities are resolved.'
    ]
  },
  {
    sNo: 47,
    code: 'BCA501',
    subject: 'COMPUTER GRAPHICS',
    fileName: 'Assignment 5_CG_Ankit Khare.docx',
    fileType: 'docx',
    uploadedFile: null,
    topic: 'Illumination Models & Surface Shading Techniques (Faculty: Mr. Ankit Khare)',
    questions: [
      'Explain the Phong Illumination Model: Ambient, Diffuse (Lambert’s Cosine Law), and Specular reflection components.',
      'Compare Gouraud Shading (intensity interpolation) and Phong Shading (normal vector interpolation).',
      'What is Mach Banding effect and why does it occur in Gouraud shading?',
      'Explain Ray Tracing algorithm for photorealistic rendering with reflections, refractions, and shadows.'
    ]
  },
  {
    sNo: 48,
    code: 'BCA502',
    subject: 'CRYPTOGRAPHY AND NETWORK SECURITY',
    fileName: 'CNS_assignment4.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Network Security Protocols: SSL/TLS, IPsec, PGP & Firewalls',
    questions: [
      'Explain the complete TLS 1.3 Handshake sequence diagram with key exchange and server certificate verification.',
      'Differentiate between IPsec Transport Mode and Tunnel Mode. Explain AH (Authentication Header) vs ESP (Encapsulating Security Payload).',
      'How does PGP (Pretty Good Privacy) provide confidentiality and authentication for electronic email?',
      'Compare Packet Filtering Firewalls, Stateful Inspection Firewalls, and Application-Level Gateways (Proxy Firewalls).'
    ]
  },
  {
    sNo: 49,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WebTechnology -ASSIGNMENT 4.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Web Performance Optimization: Core Web Vitals & Asset Bundling',
    questions: [
      'Explain Google Core Web Vitals: LCP (Largest Contentful Paint), FID (First Input Delay) / INP, and CLS (Cumulative Layout Shift).',
      'How to optimize images for the web using modern formats (WebP, AVIF), responsive srcSet, and lazy loading?',
      'Explain Tree Shaking, Minification, Gzip/Brotli compression, and Critical CSS inlining.',
      'Demonstrate browser caching using Cache-Control, ETag, and Last-Modified headers.'
    ]
  },
  {
    sNo: 50,
    code: 'BCA504',
    subject: 'MINOR PROJECT',
    fileName: 'Minor Project Synopsis Submission.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Formal Capstone Project Synopsis Submission Format',
    questions: [
      'Section 1: Project Title, Abstract (max 250 words), and Problem Definition.',
      'Section 2: Objectives, Target Beneficiaries, and Societal Impact.',
      'Section 3: Literature Review & Existing System Limitations.',
      'Section 4: Proposed Methodology, System Architecture, and Tooling/Technology Stack.',
      'Section 5: Project Timeline & Milestone Gantt Chart.'
    ]
  },
  {
    sNo: 51,
    code: 'BCA504',
    subject: 'MINOR PROJECT',
    fileName: 'Minor Project topic apporval form.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Project Topic Re-Confirmation & Ethics Clearance Document',
    questions: [
      'Declaration of Originality and Non-Plagiarism Undertaking by Student.',
      'Data Privacy and Ethical AI compliance adherence certificate.',
      'Guide Review Remarks and Topic Viability Assessment.',
      'Dean / HOD Final Signature for Semester Examination Registration.'
    ]
  },
  {
    sNo: 52,
    code: 'BCA504',
    subject: 'MINOR PROJECT',
    fileName: 'Minor Project Topics an Faculty Guide list.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Guide Allocation Review & Internal Evaluation Rubric',
    questions: [
      'Guide Allocation Review: Verification of mentor assigned vs student group roll numbers.',
      'Evaluation Component 1: Problem Formulation & Background Study (10 marks).',
      'Evaluation Component 2: System Architecture, Database Schema, and ER Design (15 marks).',
      'Evaluation Component 3: Prototype Implementation & Live Demonstration (15 marks).',
      'Evaluation Component 4: Final Viva-Voce and Project Report Quality (10 marks).'
    ]
  },
  {
    sNo: 53,
    code: 'BCA504',
    subject: 'MINOR PROJECT',
    fileName: 'Minor Project Guidelines for Students.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Report Formatting Specifications (Font, Margins & Citation Standards)',
    questions: [
      'Font: Times New Roman 12pt, 1.5 line spacing, 1-inch margins on all sides.',
      'Report Structure: Title Page, Certificate of Authenticity, Acknowledgements, Abstract, Index, Chapter 1-6, References, Appendices.',
      'Citation standard: IEEE Reference format [1], [2] for all journal papers and web documentation.',
      'Plagiarism limit: Maximum similarity index must not exceed 15% as per MUIT university norms.'
    ]
  },
  {
    sNo: 54,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WebTechnology -ASSIGNMENT 4.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'API Security: OAuth 2.0 & OpenID Connect Protocols',
    questions: [
      'Explain the OAuth 2.0 authorization framework: Resource Owner, Client, Authorization Server, Resource Server.',
      'Detail the 4 OAuth 2.0 grant types: Authorization Code, Implicit, Resource Owner Password Credentials, Client Credentials.',
      'What is PKCE (Proof Key for Code Exchange) and why is it mandatory for Single Page Apps (SPA)?',
      'Explain OpenID Connect (OIDC) identity layer built on top of OAuth 2.0 with ID Tokens.'
    ]
  },
  {
    sNo: 55,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WebTechnology -ASSIGNMENT 4.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Asynchronous Programming in JavaScript: Generators, Iterators & Observables',
    questions: [
      'Explain JavaScript Iterables, Iterators, and the Symbol.iterator protocol.',
      'What are Generator functions (function*) and the yield keyword? Implement an infinite sequence generator.',
      'Compare Promises with RxJS Observables on cancellation, multiple values, and stream operators.',
      'Demonstrate async generators (async function*) consuming paginated REST API responses.'
    ]
  },
  {
    sNo: 56,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WebTechnology -ASSIGNMENT 5.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Web Accessibility (a11y) & WCAG 2.1 Guidelines',
    questions: [
      'Explain the 4 foundational principles of WCAG 2.1 (POUR: Perceivable, Operable, Understandable, Robust).',
      'Discuss ARIA (Accessible Rich Internet Applications) attributes: role, aria-label, aria-live, and aria-expanded.',
      'How to implement keyboard navigation accessibility: focus traps in modals, tabindex, and skip links?',
      'Color contrast requirements: Calculate minimum contrast ratio (4.5:1 for normal text, 3:1 for large text).'
    ]
  },
  {
    sNo: 57,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WebTechnology -ASSIGNMENT 5.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Web Application Testing: Unit Testing, Integration & End-to-End (E2E)',
    questions: [
      'Explain the Testing Pyramid: Unit Tests, Integration Tests, and End-to-End (E2E) Tests.',
      'Write unit tests for a utility calculation function using Jest / Vitest with test assertions.',
      'How does React Testing Library test components from the end-user perspective rather than implementation details?',
      'Compare Cypress and Playwright for cross-browser automated E2E testing with headless execution.'
    ]
  },
  {
    sNo: 58,
    code: 'BCA503',
    subject: 'WEB TECHNOLOGY',
    fileName: 'WebTechnology -ASSIGNMENT 4.pdf',
    fileType: 'pdf',
    uploadedFile: null,
    topic: 'Continuous Integration / Continuous Deployment (CI/CD) & DevSecOps',
    questions: [
      'Explain the role of CI/CD pipelines in modern full-stack web software delivery.',
      'Write a GitHub Actions workflow yaml file that runs linter, executes test suites, builds production bundle, and deploys on git push to main.',
      'What is DevSecOps? Explain static application security testing (SAST) and dependency vulnerability scanning with npm audit / Snyk.',
      'Explain Blue-Green deployments and Canary releases for zero-downtime production updates.'
    ]
  }
];

// Complete Official BCA 5th Semester Student Roster (All 65 Students)
export const BCA_STUDENTS_ROSTER = [
  { studentName: 'MANOJ SHARMA', rollNo: '2401031601137', email: 'manoj.bca24@muit.in' },
  { studentName: 'ANSH GUPTA', rollNo: '2401031601046', email: 'ansh.bca24@muit.in' },
  { studentName: 'AYUSH SRIVASTAVA', rollNo: '2401031601077', email: 'ayush.bca24@muit.in' },
  { studentName: 'AYUSHI GUPTA', rollNo: '2401031601079', email: 'ayushi.bca24@muit.in' },
  { studentName: 'BADRINATH GUPTA', rollNo: '2401031601080', email: 'badrinath.bca24@muit.in' },
  { studentName: 'BHAVISHYA PRATAP SINGH', rollNo: '2401031601081', email: 'bhavishya.bca24@muit.in' },
  { studentName: 'CHAMAN', rollNo: '2401031601082', email: 'chaman.bca24@muit.in' },
  { studentName: 'CHANDRA PRAKASH SAH', rollNo: '2401031601083', email: 'chandra.bca24@muit.in' },
  { studentName: 'CHANDRANSH SINGH', rollNo: '2401031601085', email: 'chandransh.bca24@muit.in' },
  { studentName: 'DARKHSHA KHATOON', rollNo: '2401031601086', email: 'darkhsha.bca24@muit.in' },
  { studentName: 'DEEPAK', rollNo: '2401031601087', email: 'deepak.bca24@muit.in' },
  { studentName: 'DHAIRYA DIXIT', rollNo: '2401031601091', email: 'dhairya.bca24@muit.in' },
  { studentName: 'DIVANCI SAXENA', rollNo: '2401031601264', email: 'divanci.bca24@muit.in' },
  { studentName: 'DIVYANSH SRIVASTAVA', rollNo: '2401031601094', email: 'divyansh.bca24@muit.in' },
  { studentName: 'DIVYANSHU PATEL', rollNo: '2401031601095', email: 'divyanshu.bca24@muit.in' },
  { studentName: 'EKANSHI SHARAN SRIVASTAVA', rollNo: '2401031601098', email: 'ekanshi.bca24@muit.in' },
  { studentName: 'EKATA', rollNo: '2401031601099', email: 'ekata.bca24@muit.in' },
  { studentName: 'GARIMA SINGH', rollNo: '2401031601101', email: 'garima.bca24@muit.in' },
  { studentName: 'GAURAV RAWAT', rollNo: '2401031601102', email: 'gaurav.r.bca24@muit.in' },
  { studentName: 'GAURAV SHARMA', rollNo: '2401031601103', email: 'gaurav.s.bca24@muit.in' },
  { studentName: 'HARSH TRIVEDI', rollNo: '2401031601105', email: 'harsh.bca24@muit.in' },
  { studentName: 'HARSHIT PANDEY', rollNo: '2401031601283', email: 'harshit.p.bca24@muit.in' },
  { studentName: 'HARSHIT SHUKLA', rollNo: '2401031601107', email: 'harshit.s.bca24@muit.in' },
  { studentName: 'HEMANT KUMAR PANDEY', rollNo: '2401031601108', email: 'hemant.bca24@muit.in' },
  { studentName: 'HIMANSHU KUMAR', rollNo: '2401031601110', email: 'himanshu.k.bca24@muit.in' },
  { studentName: 'HIMANSHU SRIVASTAVA', rollNo: '2401031601262', email: 'himanshu.s.bca24@muit.in' },
  { studentName: 'INDRAJEET SAHANI', rollNo: '2401031601260', email: 'indrajeet.bca24@muit.in' },
  { studentName: 'ISHIKA GAUR', rollNo: '2401031601111', email: 'ishika.bca24@muit.in' },
  { studentName: 'ISHITA DIXIT', rollNo: '2401031601112', email: 'ishita.d.bca24@muit.in' },
  { studentName: 'ISHITA GUPTA', rollNo: '2401031601113', email: 'ishita.g.bca24@muit.in' },
  { studentName: 'ISHU AMAN', rollNo: '2401031601263', email: 'ishu.bca24@muit.in' },
  { studentName: 'JAVED HUSAIN', rollNo: '2401031601115', email: 'javed.bca24@muit.in' },
  { studentName: 'JAY SHUKLA', rollNo: '2401031601116', email: 'jay.bca24@muit.in' },
  { studentName: 'KARISHMA SINGH', rollNo: '2401031601119', email: 'karishma.bca24@muit.in' },
  { studentName: 'KASHIF ANSARI', rollNo: '2401031601120', email: 'kashif.bca24@muit.in' },
  { studentName: 'KASHISH CHAURASIA', rollNo: '2401031601121', email: 'kashish.bca24@muit.in' },
  { studentName: 'KAUSHAL KUMAR BHARTI', rollNo: '2401031601122', email: 'kaushal.bca24@muit.in' },
  { studentName: 'KAVYANSHI SRIVASTAVA', rollNo: '2401031601123', email: 'kavyanshi.bca24@muit.in' },
  { studentName: 'KHAN MOHD JUNED NOOR MOHAMMED', rollNo: '2401031601125', email: 'juned.bca24@muit.in' },
  { studentName: 'KHUSHI KANNOUJIYA', rollNo: '2401031601127', email: 'khushi.bca24@muit.in' },
  { studentName: 'KOMAL SINGH', rollNo: '2401031601129', email: 'komal.bca24@muit.in' },
  { studentName: 'KULDEEP MAURYA', rollNo: '2401031601130', email: 'kuldeep.bca24@muit.in' },
  { studentName: 'KUNAL PATEL', rollNo: '2401031601293', email: 'kunal.bca24@muit.in' },
  { studentName: 'MANDAVI SINGH', rollNo: '2401031601134', email: 'mandavi.bca24@muit.in' },
  { studentName: 'MANEESH SINGH', rollNo: '2401031601135', email: 'maneesh.bca24@muit.in' },
  { studentName: 'MANSI YADAV', rollNo: '2401031601138', email: 'mansi.bca24@muit.in' },
  { studentName: 'MEDHA PANDEY', rollNo: '2401031601139', email: 'medha.bca24@muit.in' },
  { studentName: 'MOHAMMAD ABDULLA', rollNo: '2401031601140', email: 'abdulla.bca24@muit.in' },
  { studentName: 'MOHAN SINGH', rollNo: '2401031601287', email: 'mohan.bca24@muit.in' },
  { studentName: 'MOHD TAUSIF KHAN', rollNo: '2401031601142', email: 'tausif.bca24@muit.in' },
  { studentName: 'MONU', rollNo: '2401031601144', email: 'monu.bca24@muit.in' },
  { studentName: 'MUJAHID HUSAIN', rollNo: '2401031601145', email: 'mujahid.bca24@muit.in' },
  { studentName: 'NANDINI KESHARWANI', rollNo: '2401031601147', email: 'nandini.bca24@muit.in' },
  { studentName: 'NILESH KUMAR SINGH', rollNo: '2401031601151', email: 'nilesh.bca24@muit.in' },
  { studentName: 'NISHANT MISHRA', rollNo: '2401031601152', email: 'nishant.bca24@muit.in' },
  { studentName: 'NITESH KUMAR CHAUHAN', rollNo: '2401031601153', email: 'nitesh.bca24@muit.in' },
  { studentName: 'NITIN RAJPOOT', rollNo: '2401031601288', email: 'nitin.bca24@muit.in' },
  { studentName: 'RAVI JAISWAL', rollNo: '2401031601176', email: 'ravi.bca24@muit.in' },
  { studentName: 'RITIK VERMA', rollNo: '2401031601182', email: 'ritik.bca24@muit.in' },
  { studentName: 'SHANTANU MISHRA', rollNo: '2401031601203', email: 'shantanu.bca24@muit.in' },
  { studentName: 'SHIVANSHI TRIPATHI', rollNo: '2401031601214', email: 'shivanshi.bca24@muit.in' },
  { studentName: 'SHREESH MISHRA', rollNo: '2401031601216', email: 'shreesh.bca24@muit.in' },
  { studentName: 'YASH SRIVASTAVA', rollNo: '2401031601316', email: 'yash.s.bca24@muit.in' },
  { studentName: 'YASHIKA UPADHYAY', rollNo: '2401031601251', email: 'yashika.bca24@muit.in' },
  { studentName: 'Kuldeep Maurya', rollNo: '2401031601130', email: 'kuldeep.m.bca24@muit.in' }
];

export const generateSeedSubmissions = (sNo, code) => {
  // Deterministic submitted count between 38 and 58 students out of 65
  const count = 38 + ((sNo * 7 + 13) % 22);
  const submissions = [];
  for (let i = 0; i < count && i < BCA_STUDENTS_ROSTER.length; i++) {
    const student = BCA_STUDENTS_ROSTER[i];
    const day = 1 + ((sNo + i) % 10);
    const hour = 9 + ((sNo * 3 + i) % 8);
    const min = 10 + ((i * 7) % 50);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    const cleanName = student.studentName.replace(/\s+/g, '_');
    submissions.push({
      studentName: student.studentName,
      rollNo: student.rollNo,
      submittedAt: `Nov 0${day}, 2026, ${displayHour < 10 ? '0' + displayHour : displayHour}:${min < 10 ? '0' + min : min} ${ampm}`,
      fileName: `${cleanName}_${code}_Assign_${sNo}_Solution.pdf`,
      fileSize: `${(1.2 + ((i % 5) * 0.4)).toFixed(1)} MB`,
      status: 'SUBMITTED',
      remarks: 'Verified complete'
    });
  }
  return submissions;
};

const STORAGE_KEY = 'scan2attend_muit_assignments_v3';

export const getStoredAssignments = () => {
  if (typeof window === 'undefined') return MUIT_ASSIGNMENTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading assignments from storage:', e);
  }

  // First time initialization with seed submissions
  const initial = MUIT_ASSIGNMENTS.map(item => ({
    ...item,
    submissions: generateSeedSubmissions(item.sNo, item.code),
    uploadedByTeacher: item.uploadedByTeacher || 'Prof. Dhananjay Kr. Yadav',
    dueDate: item.dueDate || '2026-11-20',
    createdAt: item.createdAt || '2026-11-01'
  }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    console.error('Error saving initial assignments:', e);
  }
  return initial;
};

export const saveStoredAssignments = (assignmentsList) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignmentsList));
    window.dispatchEvent(new CustomEvent('scan2attend_assignments_updated', { detail: assignmentsList }));
  } catch (e) {
    console.error('Error saving assignments to storage:', e);
  }
};

export const addTeacherAssignment = (assignmentData) => {
  const current = getStoredAssignments();
  const nextSNo = current.length > 0 ? Math.max(...current.map(a => a.sNo || 0)) + 1 : 1;
  const newAssignment = {
    sNo: nextSNo,
    code: assignmentData.code || 'BCA501',
    subject: assignmentData.subject || 'COMPUTER GRAPHICS',
    fileName: assignmentData.fileName || `${assignmentData.title || 'Assignment'}.pdf`,
    fileType: assignmentData.fileType || 'pdf',
    uploadedFile: null,
    topic: assignmentData.topic || assignmentData.title || 'Coursework Assignment',
    questions: Array.isArray(assignmentData.questions) 
      ? assignmentData.questions 
      : (assignmentData.questions ? assignmentData.questions.split('\n').filter(q => q.trim()) : ['Submit detailed solution according to university guidelines.']),
    dueDate: assignmentData.dueDate || '2026-11-25',
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    uploadedByTeacher: assignmentData.uploadedByTeacher || 'Faculty Department of Computer Science',
    isNewFacultyUpload: true,
    submissions: [] // Initially 0 submissions
  };
  const updated = [newAssignment, ...current];
  saveStoredAssignments(updated);
  return newAssignment;
};

export const recordStudentSubmission = (sNo, studentName, rollNo, fileName) => {
  const current = getStoredAssignments();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + 
    ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const updated = current.map(asn => {
    if (asn.sNo === sNo) {
      const existingSubs = Array.isArray(asn.submissions) ? [...asn.submissions] : [];
      const existingIdx = existingSubs.findIndex(s => s.rollNo === rollNo || s.studentName === studentName);
      const submissionRecord = {
        studentName: studentName || 'MANOJ SHARMA',
        rollNo: rollNo || '2401031601137',
        submittedAt: dateStr,
        fileName: fileName || `${(studentName || 'Manoj').replace(/\s+/g, '_')}_Assign_${sNo}_Solution.pdf`,
        fileSize: '1.8 MB',
        status: 'SUBMITTED',
        remarks: 'Student portal submission verified'
      };
      if (existingIdx >= 0) {
        existingSubs[existingIdx] = submissionRecord;
      } else {
        existingSubs.unshift(submissionRecord);
      }
      return {
        ...asn,
        uploadedFile: fileName,
        submissions: existingSubs
      };
    }
    return asn;
  });

  saveStoredAssignments(updated);
  return updated;
};

