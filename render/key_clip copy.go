package render

import "github.com/gofiber/fiber/v2"

func NegativeDetailsPage(c *fiber.Ctx) error {

	return Render("page-negative-details/index", fiber.Map{
		"title": "auth",
	}, c)
}
