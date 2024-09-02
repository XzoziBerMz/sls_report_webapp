package render

import "github.com/gofiber/fiber/v2"

func ProductOrderwPage(c *fiber.Ctx) error {

	return Render("page-product-order/index", fiber.Map{
		"title": "auth",
	}, c)
}
