package render

import "github.com/gofiber/fiber/v2"

func HomePage(c *fiber.Ctx) error {

	return Render("page-home/index", fiber.Map{
		"title": "auth",
	}, c)
}
