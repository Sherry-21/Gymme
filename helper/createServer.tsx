import { createServer } from "miragejs";

const create_server = () => {
  createServer({
    routes() {
      this.namespace = ""; // Use empty namespace for direct match or customize if needed

      // Mock route for search results
      this.get("/searchResult/", (schema, request) => {
        const name = request.queryParams.name;

        return {
          equipment: {
            id: "1",
            name: name,
            image: "https://reactnative.dev/img/tiny_logo.png",
            muscleCategory: ["test1", "test2", "test3", "test4", "test5"],
          },
        };
      });

      // Mock route for equipment detail
      this.get("/equipment-detail", () => {
        return {
          equipmentDetail: {
            name: "lol",
            videoLink:
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            description:
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate iure earum aut quia nihil similique natus sit quasi accusamus. Iusto repellat, adipisci ea voluptates architecto ad repudiandae officiis vitae, voluptatem suscipit nam, aspernatur molestias necessitatibus expedita optio praesentium sit est quia. Soluta voluptatibus perspiciatis incidunt totam itaque earum quas est.",
          },
        };
      });

      // Mock route for user registration
      this.post("/api/user/register", (schema, request) => {
        return {
          data: "string",
          message: request.requestBody,
          status_code: 0,
          success: true,
        };
      });

      // Mock route for user login
      this.post("/api/user/login2", (schema, request) => {
        return {
          data: "string",
          message: request.requestBody,
          status_code: 200,
          success: true,
        };
      });

      // Allow passthrough requests to the real backend for all other routes
      this.passthrough("http://localhost:3000/**");
      this.passthrough(); // Optional: Allow other non-mocked requests (e.g., external API calls)
    },
  });
};

export default create_server;
