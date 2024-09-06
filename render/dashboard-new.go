package render

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func DashboardNewPage(c *fiber.Ctx) error {
	cookie := c.Cookies("token")
	if cookie == "" {
		log.Println("token cookie not found")
		return c.Redirect("/login")
	}
	return Render("page-dashboard-new/index", fiber.Map{
		"title": "auth",
	}, c)
}
