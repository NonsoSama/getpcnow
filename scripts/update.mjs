// One command to refresh everything from YOUR computer:  node scripts/update.mjs
// Runs the offer finder and the listing checker, then saves the results to GitHub.
// Run it from the repo folder. Jiji and Jumia accept home internet far more often than GitHub's servers.
import { execSync } from "node:child_process";
const run = c => { console.log("\n> " + c); execSync(c, { stdio: "inherit" }); };
run("git pull --rebase --autostash");
run("node scripts/find-offers.mjs");
run("node scripts/check-listings.mjs");
run("git add dead.js offers-auto.js listing-status.json");
try { execSync("git diff --staged --quiet"); console.log("\nNothing changed."); }
catch { run('git commit -m "Update listings"'); run("git push"); console.log("\nPushed. Your site will update shortly."); }
