package render

import "github.com/gofiber/fiber/v2"

func AdsPage(c *fiber.Ctx) error {

	return Render("page-ads/index", fiber.Map{
		"title": "auth",
	}, c)
}
