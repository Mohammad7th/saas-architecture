import jsonServer from "json-server";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { editUserSchema, loginSchema, profileSchema } from "./validation.js";
import { seedUsers } from "./seed.js";
const dbPath =
  process.env.API_DB_FILE ??
  fileURLToPath(new URL("../data/db.json", import.meta.url));
if (!existsSync(dbPath)) {
  mkdirSync(dirname(dbPath), { recursive: true });
  writeFileSync(dbPath, JSON.stringify({ users: seedUsers }, null, 2));
}
const db = jsonServer.router(dbPath).db;
const users = () => db.get("users").value();
const save = (user, patch) => {
  const updated = { ...user, ...patch };
  db.set(
    "users",
    users().map((item) => (item.id === user.id ? updated : item)),
  ).write();
  return updated;
};
const sessions = new Map();
const cookieName = "saas_demo_session";
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/api",
};
const token = (req) =>
  req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);
const fail = (res, status, message) => res.status(status).json({ message });
const server = jsonServer.create();
server.use(jsonServer.bodyParser);
server.use((_req, _res, next) => {
  setTimeout(next, 250);
});
server.post("/api/auth/login", (req, res) => {
  const input = loginSchema.safeParse(req.body);
  if (!input.success)
    return fail(res, 422, "Enter a valid email and password.");
  const user = users().find(
    (item) => item.email === input.data.email.toLowerCase(),
  );
  if (!user || input.data.password !== "demo1234")
    return fail(res, 401, "Incorrect email or password.");
  const oldToken = token(req);
  if (oldToken) sessions.delete(oldToken);
  for (const [key, value] of sessions)
    if (value.expiresAt <= Date.now()) sessions.delete(key);
  const id = randomUUID();
  const expiresAt = Date.now() + 60 * 60 * 1000;
  sessions.set(id, { userId: user.id, expiresAt });
  res.cookie(cookieName, id, { ...cookieOptions, maxAge: 60 * 60 * 1000 });
  return res.json({ user, expiresAt });
});
server.post("/api/auth/logout", (req, res) => {
  const id = token(req);
  if (id) sessions.delete(id);
  res.clearCookie(cookieName, cookieOptions);
  res.status(204).end();
});
server.use("/api", (req, res, next) => {
  const id = token(req);
  const session = id ? sessions.get(id) : undefined;
  const user =
    session && session.expiresAt > Date.now()
      ? users().find((item) => item.id === session.userId)
      : undefined;
  if (!user) {
    if (id) sessions.delete(id);
    return fail(res, 401, "Your session has ended. Please sign in.");
  }
  res.locals.user = user;
  res.locals.expiresAt = session.expiresAt;
  next();
});
server.get("/api/auth/me", (_req, res) =>
  res.json({ user: res.locals.user, expiresAt: res.locals.expiresAt }),
);
server.get("/api/me", (_req, res) => res.json(res.locals.user));
server.patch("/api/me", (req, res) => {
  const input = profileSchema.safeParse(req.body);
  if (!input.success)
    return fail(
      res,
      422,
      "Check the profile fields. Only name, email and title can be edited.",
    );
  const user = res.locals.user;
  if (
    users().some(
      (item) => item.id !== user.id && item.email === input.data.email,
    )
  )
    return fail(res, 409, "This email address is already in use.");
  return res.json(save(user, input.data));
});
server.use("/api/users", (_req, res, next) => {
  if (res.locals.user.role !== "admin")
    return fail(res, 403, "An administrator account is required.");
  next();
});
server.get("/api/users", (req, res) => {
  const search = String(req.query.search ?? "").toLowerCase();
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 5);
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 50
  )
    return fail(res, 422, "Invalid pagination.");
  const filtered = users().filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search),
  );
  return res.json({
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
  });
});
server.get("/api/users/:id", (req, res) => {
  const user = users().find((item) => item.id === req.params.id);
  return user
    ? res.json(user)
    : fail(res, 404, "This user could not be found.");
});
server.patch("/api/users/:id", (req, res) => {
  const user = users().find((item) => item.id === req.params.id);
  if (!user) return fail(res, 404, "This user could not be found.");
  const input = editUserSchema.safeParse(req.body);
  if (!input.success) return fail(res, 422, "Check the user fields.");
  if (user.id === res.locals.user.id && input.data.role !== "admin")
    return fail(res, 422, "You cannot remove your own administrator role.");
  if (
    users().some(
      (item) => item.id !== user.id && item.email === input.data.email,
    )
  )
    return fail(res, 409, "This email address is already in use.");
  return res.json(save(user, input.data));
});
// Do not mount the generic JSON router: every exposed route must enforce permissions.
server.use((_req, res) => fail(res, 404, "Endpoint not found."));
const onError = (error, _req, res, _next) => {
  if (error instanceof SyntaxError) {
    fail(res, 400, "Invalid JSON payload.");
    return;
  }
  console.error(error);
  fail(res, 500, "Unable to process the request.");
};
server.use(onError);
const port = Number(process.env.API_PORT ?? 4000);
server.listen(port, "127.0.0.1", () =>
  console.log(`Mock API: http://localhost:${port}/api`),
);
