package render

import "github.com/gofiber/fiber/v2"

func KeyOrderPage(c *fiber.Ctx) error {

	return Render("page-key-order/index", fiber.Map{
		"title": "auth",
	}, c)
}
