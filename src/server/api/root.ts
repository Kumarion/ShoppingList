import { createTRPCRouter } from "./trpc";
import { shoppingListRouter } from "./routers/shoppingListRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  shoppingList: shoppingListRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
