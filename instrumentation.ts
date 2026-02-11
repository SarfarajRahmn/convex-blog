export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // We use a dynamic import to avoid issues in edge runtime if not needed
    const { Agent, setGlobalDispatcher } = await import("undici");

    // Create a global dispatcher that forces IPv4
    setGlobalDispatcher(
      new Agent({
        connect: {
          family: 4, // Force IPv4
        },
      }),
    );

    console.log(
      "Global fetch dispatcher configured to force IPv4 (ConnectTimeout fix)",
    );
  }
}
