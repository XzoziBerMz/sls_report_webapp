package render

import "github.com/gofiber/fiber/v2"

func KeyClipPage(c *fiber.Ctx) error {

	return Render("page-key-clip/index", fiber.Map{
		"title": "auth",
	}, c)
}
