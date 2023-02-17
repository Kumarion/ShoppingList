import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const shoppingListRouter = createTRPCRouter({
  // Creating a shopping list given the name and (somehow authenticated) user id
  createShoppingList: publicProcedure
    .input(
      z.object({
        name: z.string(),
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shoppingLists.create({
        data: {
          name: input.name,
          userId: input.userId,
        },
      });
    }),

  // Adding an item to a shopping list given the shopping list id and the item name
  addItemToShoppingList: publicProcedure
    .input(
      z.object({
        shoppingListId: z.string(),
        name: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shoppingListItems.create({
        data: {
          name: input.name,
          shoppingListId: input.shoppingListId,
          quantity: input.quantity,
        },
      });
    }),

  // Getting all shopping lists for a given user id
  getUserShoppingLists: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.shoppingLists.findMany({
        where: {
          userId: input.userId,
        },
      });
  }),

  // Getting all items for a given shopping list id
  getShoppingListItems: publicProcedure
    .input(
      z.object({
        shoppingListId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.shoppingListItems.findMany({
        where: {
          shoppingListId: input.shoppingListId,
        },
      });
  }),

  // Deleting a shopping list item given the item id
  deleteShoppingListItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shoppingListItems.delete({
        where: {
          id: input.id,
        },
      });
  }),

  // Deleting a shopping list given the shopping list id
  deleteShoppingList: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shoppingLists.delete({
        where: {
          id: input.id,
        },
      });
  }),

  // Toggle checked
  toggleShoppingListItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
        checked: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shoppingListItems.update({
        where: {
          id: input.id,
        },
        data: {
          checked: input.checked
        },
      });
  }),
});
