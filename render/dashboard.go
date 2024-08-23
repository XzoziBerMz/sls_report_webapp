package render

import "github.com/gofiber/fiber/v2"

func DashboardPage(c *fiber.Ctx) error {

	return Render("page-dashboard/index", fiber.Map{
		"title": "auth",
	}, c)
}
