/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/create") {
      const { results } = await env.DB.prepare(
        `INSERT INTO Customers (CustomerID, CompanyName, ContactName) VALUES (${Math.floor(
          Math.random() * 1000
        )}, 'Theodo', 'Random name ${Math.floor(Math.random() * 10000)}')`
      ).all();
      return Response.json(results);
    }

    if (pathname === "/list") {
      const { results } = await env.DB.prepare("SELECT * FROM Customers").all();
      return Response.json(results);
    }

    if (pathname === "/update") {
      const { results } = await env.DB.prepare(
        "UPDATE Customers SET CompanyName = ?1 WHERE CompanyName = ?2"
      )
        .bind("Theodo", "Around the Horn")
        .all();
      return Response.json(results);
    }

    if (pathname === "/delete") {
      const { results } = await env.DB.prepare(
        "DELETE FROM Customers WHERE CompanyName = ?"
      )
        .bind("Alfreds Futterkiste")
        .all();
      return Response.json(results);
    }

    return new Response(
      "Call /api/beverages to see everyone who works at Bs Beverages"
    );
  },
};
