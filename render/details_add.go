package render

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func DetailsAddPage(c *fiber.Ctx) error {

	cookie := c.Cookies("token")
	if cookie == "" {
		log.Println("token cookie not found")
		return c.Redirect("/login")
	}
	
	basepath := c.Locals("Basepath").(string)
	return Render("page-details-add/index", fiber.Map{
		"title": "auth",
		"Basepath": basepath,
	}, c)
}