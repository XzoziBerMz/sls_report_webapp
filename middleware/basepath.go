package middleware

import "github.com/gofiber/fiber/v2"

func Basepath(basepath string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("Basepath", basepath)
		return c.Next()
	}
}