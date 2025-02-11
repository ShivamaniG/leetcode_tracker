const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/api/profile/:username", async (req, res) => {
  const usernameParam = req.params.username;
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();


    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );

    const profileUrl = `https://leetcode.com/${usernameParam}/`;
    await page.goto(profileUrl, { waitUntil: "networkidle2" });

    // Wait for a key element to ensure the page has loaded.
    await page.waitForSelector("img.h-20.w-20.rounded-lg.object-cover", { timeout: 15000 });

    const data = await page.evaluate(() => {
      // --- Avatar, Name, Username ---
      const avatarElement = document.querySelector("img.h-20.w-20.rounded-lg.object-cover");
      const avatar = avatarElement ? avatarElement.src : "";

      const usernameElement = document.querySelector("div.text-label-3");
      const username = usernameElement ? usernameElement.textContent.trim() : "";

      let totalSolved = { solved: 0, total: 0 };
      const allTextContainers = Array.from(document.querySelectorAll("div.text-sd-foreground"));
      const totalContainer = allTextContainers.find(el => {
        const txt = el.innerText;
        return txt.includes("Solved") && /\d+\s*\/\s*\d+/.test(txt);
      });
      if (totalContainer) {
        const match = totalContainer.innerText.match(/(\d+)\s*\/\s*(\d+)/);
        if (match) {
          totalSolved = {
            solved: parseInt(match[1], 10),
            total: parseInt(match[2], 10)
          };
        }
      }

      const parseDifficulty = (labelClass) => {
        const labelElem = document.querySelector(`div.${labelClass}`);
        if (labelElem && labelElem.nextElementSibling) {
          const text = labelElem.nextElementSibling.innerText;
          const match = text.match(/(\d+)\s*\/\s*(\d+)/);
          if (match) {
            return {
              solved: parseInt(match[1], 10),
              total: parseInt(match[2], 10)
            };
          }
        }
        return { solved: 0, total: 0 };
      };

      const easy = parseDifficulty("text-sd-easy");
      const medium = parseDifficulty("text-sd-medium");
      const hard = parseDifficulty("text-sd-hard");

      return {
        avatar,
        username,
        totalSolved,
        breakdown: { easy, medium, hard }
      };
    });

    await browser.close();

    console.log("Scraped Data:", data);
    res.json(data);
  } catch (error) {
    console.error("Error scraping profile data:", error);
    res.status(500).json({ error: "Failed to scrape profile data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
