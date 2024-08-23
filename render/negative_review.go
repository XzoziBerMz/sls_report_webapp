package render

import "github.com/gofiber/fiber/v2"

func NegativeReviewPage(c *fiber.Ctx) error {

	return Render("page-negative-review/index", fiber.Map{
		"title": "auth",
	}, c)
}
