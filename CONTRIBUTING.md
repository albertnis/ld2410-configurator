# Contributing

Thanks for considering a code contribution to LD2410 Configurator!

# Code style

Biome is used for linting and formatting; PRs must pass automated formatting and linting checks. It is recommended to use the Biome extension for your code editor.

Prefer readability and simplicity over conciseness. For example:

- Prefer early returns over highly nested ternaries or if blocks.
- Prefer procedural `for const of` over functional `Array.prototype.forEach()` or `Array.prototype.reduce()`.

Attempt to minimise dependencies. Currently LD2410 configurator uses RxJS as the only runtime dependency and Bun and Biome as the only dev dependencies. Accordingly: use built-in Bun features and RxJS where possible.

Make a basic effort to implement accessibility. At a minimum, this means relying on semantic HTML and leveraging modern browser APIs instead of JS libraries (for example: dialogs and popovers). It's OK to assume users of this particular software are running up-to-date browsers.

## View logic

No frontend framework is in use here.

RxJS events emitted by the client are subscribed to by modular components in the `src/components` directory. Components manually update the DOM in response to these events.

To add a new view, implement a static version in `index.html` then add a new file in `src/components` which is imported in `src/app.ts`. Feel free to make these files granular; you don't need to re-use an existing file.

A component generally has element definitions, then a bunch of subscribers which kick off certain manipulations when certain events are seen. Refer to the existing components for examples.

Avoid CSS-in-JS and markup-in-JS. All markup must live in `index.html`. Use a `template` element if you need to dynamically re-use a component.

# Testing

Isolated and functional logic should be unit tested. The repository doesn't exactly abide by this currently, so consider it more a rule of thumb than a rule.

Please manually test new features with a real device before submitting a PR.

# Pull requests

Please open a PR and follow the steps in the [template](./github/pull_request_template.md).

## LLM-generated code

LLM- or "AI"-generated code is acceptable, with two caveats:

- PRs must be opened by a human. Automated or agent-opened PRs will be closed.
- The human opening the PR must have reviewed and understand every single changed line of code in the PR.

This policy is subject to change.

# Recognition

The current in-app attribution places me, Albert, as primary contributor, as below:

> Made with ♥ by <ins>Albert</ins> and <ins>contributors</ins>

If you think your contribution warrants naming yourself in the in-app message, please suggest it as a comment or change in a PR.
