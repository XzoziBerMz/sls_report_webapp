package render

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func ReportTiktokLivePage(c *fiber.Ctx) error {
	cookie := c.Cookies("token")
	if cookie == "" {
		log.Println("token cookie not found")
		return c.Redirect("/login")
	}
	basepath := c.Locals("Basepath").(string)
	return Render("page-report-tiktok-live/index", fiber.Map{
		"title": "auth",
		"Basepath": basepath,
	}, c)
}
func AdsTiktokPage(c *fiber.Ctx) error {
	cookie := c.Cookies("token")
	if cookie == "" {
		log.Println("token cookie not found")
		return c.Redirect("/login")
	}
	basepath := c.Locals("Basepath").(string)
	return Render("page-ads-tiktok/index", fiber.Map{
		"title": "auth",
		"Basepath": basepath,
	}, c)
}
