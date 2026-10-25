# Student experience review — 22 October 2026

This is a code review and desk research followed by a local prototype. It is not a completed study with students. The two reports of difficulty are useful signals; task priorities still need checking with students.

## Design direction

Preserve the existing sections, photography, cards and curved layouts. Use a blue-and-white interface with Poppins. The homepage opens directly on the photo with a short white heading and description. Its shorter height brings a three-task student services section into view sooner, followed by upcoming events and resources. Community, impact, programme and newsletter sections and their images remain further down. The intro, skip button, old slogan banner and four hero shortcut buttons have been removed at the owner's request. Photos and actual product colour swatches retain their colours.

## Research and decisions

- [Nielsen Norman Group: Homepage design principles](https://www.nngroup.com/articles/homepage-design-principles/) and [Homepage usability guidelines](https://www.nngroup.com/articles/top-ten-guidelines-for-homepage-usability/) support clear starting points and useful link labels. The main navigation retains explicit task labels. Resource links before the original immersive image provide a shorter route to materials. All original homepage sections below the hero remain.
- [W3C: Animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) explains motion accessibility. Removed the timed introduction entirely and replaced the looping zoom hero with a static photo and readable blue gradient. Other animations still need a separate accessibility audit.
- [W3C: Target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum/) explains target size and spacing. New shortcut controls have at least 44px height. Added a public skip link, keyboard focus outlines, active-page attributes and Escape to close the original mobile menu. This is not a full WCAG conformance claim.
- [Next.js: Font component](https://nextjs.org/docs/pages/api-reference/components/font) documents loading and self-hosting fonts. Poppins uses next/font/google, four weights, Latin subset and swap display. Existing decorative serif/monospace styles remain. Font choice reflects the owner's preference, not proof of improved usability.
- [Nielsen Norman Group: Usability testing 101](https://www.nngroup.com/articles/usability-testing-101/) supports observing realistic tasks. Validate this version with approximately five ICT students, including mobile users and students unfamiliar with the site.

## Task priority and accessibility

The assumed priorities are study resources, dues and events; student testing should validate that order. Three image-backed service cards provide clear primary actions and direct links to past papers and dues balance. The header is a stable white bar with a left logo and right navigation; mobile uses a native disclosure dropdown with Escape, outside-click dismissal and focus returned to the toggle on Escape. Available resource cards precede coming-soon cards. A visible matric-number label and live balance results improve form access. The payment dialog receives focus, traps Tab while open, closes with Escape and restores focus to its trigger. Keyboard skip links, visible outlines, 44px primary targets and reduced-motion support are retained. The floating feedback control is omitted from the homepage; contact remains in the footer. These are targeted accessibility improvements, not a full conformance claim.

## Targeted improvements

Photos, curved layouts, cards, events mosaic, fee storytelling, newsletter and footer retained. Homepage sections are reordered around student tasks. Public presentation colours use blue and white across headings, cards, buttons, menus and modals; thin blue borders separate white cards. Accents adapt to their blue or white surface. Product swatches and photographs retain their real colours. The hero has no intro, slogan panel or shortcut buttons. Resource availability labels, direct resource navigation and the dues balance link remain. Checkout and ticketing behaviour is unchanged.

## Student review script

Ask each student to think aloud, without showing them the route first:

1. Find a past paper for a course you take and preview or download it.
2. Find how much ITCA dues cost and open the payment form. Stop before submitting.
3. Find where to check your dues balance. Use a test record only.
4. Find the next event and where to view details or book tickets, if one exists.
5. Find a shop item and review the cart, if the local catalogue contains products. Stop before checkout.

Record task completion, first click, time, wrong turns and comments. Ask what they expected whenever they hesitate. Compare the same tasks with the previous version if available; avoid telling students the new design is easier.

## Local validation

TypeScript and Microsoft Edge checks pass for the task-prioritised version at widths 320, 390, 768, 1024 and 1440px. The header places the logo left and links right; the mobile disclosure closes with Escape and restores focus. The skip link reaches main content. The dues dialog receives focus, wraps Tab/Shift+Tab inside it, closes with Escape and restores focus to the trigger. The balance input has a visible label. Available resource categories are first. No document overflow or uncaught page errors were observed. Checks cover preserved sections, removal of the intro and old banner, Poppins, the mobile menu, blue/white text contrast and narrow-screen overflow. No actual payment or checkout submission is included. Automated checks do not replace student testing.

Frontend: http://127.0.0.1:3000. Existing local API and MongoDB configuration are used. Email delivery is unavailable when RESEND_API_KEY is absent. Empty local data is not filled with invented content.

## Inner pages and visible fields

Resources now starts with its three working categories, Events with upcoming listings, Shop with search/filters and catalogue, and Programmes with programme details. Supporting photos and editorial content follow those actions. Dues payment and the labelled balance checker appear before the fee explanation panels. The hackathon application uses a short functional heading. Past-paper search, course and department filters have persistent labels; content clears the fixed header. Public task pages omit floating feedback and newsletter distractions where appropriate.

Text fields, selects and textareas use a visible blue border, white fill, readable placeholders, a clear focus outline and at least 44px height. Existing checkboxes, radios, hidden inputs and product swatches keep their appropriate controls. Field text is at least 16px to avoid automatic zoom on mobile. Payment submission behaviour is unchanged.
