# Pixify  
**Unleash Your Creative Vibes**

### Overview  
Pixify is a scalable, full-stack social media application designed to enhance user interaction and creativity. Built with modern web technologies, this project showcases robust frontend integration with Appwrite, providing users with a seamless and engaging experience. With a focus on a sleek UI and responsive design, Pixify is set to grow and evolve.

---

## Screenshots  

<div style="display: flex; justify-content: space-between;">

  <div style="text-align: center;">
    <img src="./public/assets/pixify%20web.jpg" alt="Pixify Screenshot" width="290px">
  </div>

  <div style="text-align: center;">
    <img src="./public/assets/pixify%20Phone.jpg" alt="Pixify Screenshot" height="150px">
  </div>

</div>




## Tech Stack  

### Frontend
- **React**: Library for building user interfaces.
- **Redux**: State management for predictable data flow.
- **Vite**: Fast build tool for modern web projects.

### UI & Styling
- **shadcn**: Styled components for creating a cohesive look.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.


### Dependencies
Here are the key packages used in the project:
```json
{
  "@radix-ui/react-toast": "^1.2.2",
  "@tanstack/react-query": "^5.59.16",
  "appwrite": "^16.0.2",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-dropzone": "^14.2.10",
  "react-hook-form": "^7.53.1",
  "react-intersection-observer": "^9.13.1",
  "react-router-dom": "^6.27.0",
  "tailwind-merge": "^2.5.4",
  "use-debounce": "^10.0.4",
  "zod": "^3.23.8"
}
```

---

## Environment Variables  
To run this project, you will need to create a `.env` file in the root of your frontend directory with the following variables:

```plaintext
VITE_APPWRITE_PROJECT_ID=""
VITE_APPWRITE_URL=""
VITE_APPWRITE_STORAGE_ID=""
VITE_APPWRITE_DATABASE_ID=""
VITE_APPWRITE_USER_COLLECTION_ID=""
VITE_APPWRITE_POST_COLLECTION_ID=""
VITE_APPWRITE_SAVES_COLLECTION_ID=""
VITE_APPWRITE_FOLLOWERS_COLLECTION_ID="
VITE_APPWRITE_COMMENTS_COLLECTION_ID=""
```

---

## Key Features  
- **User Authentication**: Secure login and registration managed by Appwrite.
- **Real-time Interactions**: Instant updates for a dynamic user experience.
- **State Management**: Redux for managing user states and application data seamlessly.
- **Responsive Design**: Mobile-first approach ensuring a polished look across devices.
- **Smooth Animations**: Implemented transitions for delightful transitions.

---

## Future Implementations  
In Pixify, I plan to implement the following features:
1. **Follow and Following List**: Easily view and manage followers with a click.
2. **Chat and Messaging Page**: Enable direct communication between users.
3. **Stories or Time-Oriented Posts**: Introduce temporary posts for users to share updates.
4. **More Operations in Comments**: Add functionalities like deleting and copying comments.
5. **Collection for Saved Posts**: Allow users to save and organize their favorite posts.

---

## Project Structure  
The project is organized as follows:
- **Frontend**: A React-based user interface, utilizing Redux for state management and styled using shadcn and Tailwind CSS.

---

## Setup Instructions  

### Prerequisites  
- **Node.js** (v14 or higher)
- **npm** or **yarn** (for managing dependencies)
- **Appwrite**: Ensure you have an Appwrite server running.

### Frontend Setup  
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Scripts  

### Frontend
- `dev`: Starts the Vite development server

---

## Contributing

We welcome contributions to improve WonderWords! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.


## Authors

- [@Arnabjk008](https://www.github.com/xensen008)
- [Bio Links](https://xensen008.bio.link)


## Acknowledgments

A big thank you to the developers of ReactJS, Tailwind CSS, NodeJS, Express, and Appwrite for their incredible tools.