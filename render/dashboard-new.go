package render

import "github.com/gofiber/fiber/v2"

func DashboardNewPage(c *fiber.Ctx) error {

	return Render("page-dashboard-new/index", fiber.Map{
		"title": "auth",
	}, c)
}
