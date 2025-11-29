# Use the official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript code (assuming you have a 'build' script in package.json)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the compiled app
CMD ["node", "./dist/index.js"]
