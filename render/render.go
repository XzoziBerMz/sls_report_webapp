package render

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func Render(page string, value fiber.Map, c *fiber.Ctx) error {
	value["csrf_token"] = c.Cookies("csrf_")
	return c.Render(page, value)
}

func AdsPage(c *fiber.Ctx) error {
	cookie := c.Cookies("token")
	if cookie == "" {
		log.Println("token cookie not found")
		return c.Redirect("/login")
	}
	basepath := c.Locals("Basepath").(string)
	return Render("page-ads/index", fiber.Map{
		"title": "auth",
		"Basepath": basepath,
	}, c)
}

func AdsFormPage(c *fiber.Ctx) error {
	cookie := c.Cookies("token")
	if cookie == "" {
		log.Println("token cookie not found")
		return c.Redirect("/login")
	}
	basepath := c.Locals("Basepath").(string)
	return Render("page-ads-form/index", fiber.Map{
		"title": "auth",
		"Basepath": basepath,
	}, c)
}
func CampaignFormPage(c *fiber.Ctx) error {
	cookie := c.Cookies("token")
	if cookie == "" {
		log.Println("token cookie not found")
		return c.Redirect("/login")
	}
	basepath := c.Locals("Basepath").(string)
	return Render("page-campaign/index", fiber.Map{
		"title": "auth",
		"Basepath": basepath,
	}, c)
}

func ChatPage(c *fiber.Ctx) error {
	cookie := c.Cookies("token")
	if cookie == "" {
		log.Println("token cookie not found")
		return c.Redirect("/login")
	}
	basepath := c.Locals("Basepath").(string)
	return Render("page-chat/index", fiber.Map{
		"title": "auth",
		"Basepath": basepath,
	}, c)
}

func LoginPage(c *fiber.Ctx) error {

	basepath := c.Locals("Basepath").(string)
	return Render("page-login/index", fiber.Map{
		"title": "auth",
		"Basepath": basepath,
	}, c)
}

func ImportVideoPage(c *fiber.Ctx) error {
	cookie := c.Cookies("token")
	if cookie == "" {
		log.Println("token cookie not found")
		return c.Redirect("/login")
	}
	basepath := c.Locals("Basepath").(string)
	return Render("page-video/index", fiber.Map{
		"title": "auth",
		"Basepath": basepath,
	}, c)
}
