# How to add SpandanAI team members

This guide is for adding **real** people, photographs, and (later) LinkedIn URLs to the website.

Do **not** invent names, job titles, photos, or profile links.

The homepage Leadership section always shows only the current four founding leaders.

Everyone else appears on the **Team page** at `/team`.

---

## 1. Add a photograph

Put the file in:

`public/images/`

Preferred filename style for **new** photos:

- lowercase
- hyphens between words
- no spaces

Example:

`real-name.webp`

The four existing leadership photographs already in the repo keep their current filenames. Do not rename those in this step.

Recommended format: WebP (JPEG is also fine).

---

## 2. Add a person in the data file

Open:

`src/data/teamContent.js`

There are three lists:

- `leadershipMembers` — the four leaders on the homepage **and** `/team`
- `teamMembers` — additional people, shown **only** on `/team`
- `teamGroupPhoto` — optional group photograph, shown **only** on `/team` when a real file exists

To add someone to the wider team, append an object to `teamMembers`:

```js
{
  id: "person-id",
  name: "Real Name",
  role: "Real Role",
  image: "/images/real-name.webp",
  linkedin: null
}
```

Use a short unique `id` (lowercase, hyphens).

`image` should match the file you placed under `public/images/`.

If a photograph is not ready yet, you may set:

`image: null`

The page will show a simple initials panel. It will **not** fetch stock photos.

---

## 3. Save

Save `src/data/teamContent.js`.

The new person appears automatically on `/team`.

They will **not** appear on the homepage.

---

## LinkedIn

Leave `linkedin: null` until the real profile URL is provided.

The website does **not** show LinkedIn icons or clickable cards while the value is null.

Do not guess URLs.

---

## Group photograph

When a real group photo exists:

1. Add the file under `public/images/` (for example `team-group.webp`).
2. In `src/data/teamContent.js`, set:

```js
export const teamGroupPhoto = {
  src: "/images/team-group.webp",
  alt: "Real caption describing the photograph"
};
```

Until that object exists, `/team` does not show an empty photo box.

---

## Leadership (homepage)

Do not add extra people to `leadershipMembers` unless leadership on the homepage is meant to change.

Homepage Leadership remains the current four:

- N.R. Rohan — Chief Executive Officer
- K. Dharanidhar G — Chief Technology Officer
- S. Aniruddhan — Director
- V. S. Chakravarthy — Director
