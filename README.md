# Genealogy Tree Manager

An interactive family tree manager built with React, TypeScript, and Vite.

## Features

- **Visual family tree** — pan/zoom canvas with automatic generation-based layout, couples shown side by side, and elbow connectors for parent/child and spouse relationships.
- **Full CRUD** — add, edit, and delete people with name, gender, birth/death dates & places, photo URL, and notes.
- **Relationship management** — link parents, spouses/partners, and children either by creating a new person or linking an existing one; unlink with one click.
- **Search** — filter the people list by name in the sidebar; click to select and focus them in the tree.
- **Root & focus** — set any person as the tree's root/anchor point.
- **Import / export** — save your tree as JSON and load it back in.
- **Persistence** — the tree is saved to `localStorage` automatically.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Build

```bash
npm run build
```

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4, Zustand (with localStorage persistence), lucide-react icons.
