package handlers

import (
	"mai/services"

	"github.com/gofiber/fiber/v2"
)

func GetPokemonApiHandler(c *fiber.Ctx) error {
	sv, err := services.New(services.CustomConfigFileOption())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "internet server error",
			"status":  fiber.StatusInternalServerError,
		})
	}
	resp, err := sv.GetUser()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "internet server error",
			"status":  fiber.StatusInternalServerError,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": resp,
	})
}
