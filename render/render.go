package render

import "github.com/gofiber/fiber/v2"

func Render(page string, value fiber.Map, c *fiber.Ctx) error {
	value["csrf_token"] = c.Cookies("csrf_")
	return c.Render(page, value)
}
