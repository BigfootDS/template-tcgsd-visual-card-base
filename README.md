# tcgsd-visual-card-base
Example repo for how to layout the visuals of a trading card in the TCG Set Designer system.

## Data Interpolation

In the TCGSD system, a Visual Card Template must be a HTML file that lets the TCGSD interpolate data into its contents. For example, HTML like this:

```html
<div class="example-vct">
	<section>
		<h1>
			tcgsd:name
		</h1>
		<h2>
			tcgsd:types
		</h2>
		<h2>
			tcgsd:resource1
		</h2>
	</section>
</div>
```

...is going to have the `tcgsd:blah-blah-blah` properties replaced with actual data from the TCGSD server.

This does mean that your TCGSD server is going to be dangerously loading some external HTML, so make sure you do your due diligence when picking your template packages for your TCGSD instance.


## Template Structure

All Visual Card Templates must have this file structure:

```
- some-file-name.zip
  - index.html
  - metadata.json

```

Any other files within the ZIP folder must use relative paths so that the TCGSD server can serve them correctly to the template when it's loaded by a client. 

## Metadata

The ZIP file can be named whatever you like, it doesn't matter. When the template is viewed by a client, the internal name used by the `metadata.json` file in the template files will be used by the server to find further information about the template. The server information will match the `metadata.json` file contents, but just have correct references to other database entries for things like the game.

The `metadata.json` file should have data as follows:

```typescript
export interface VisualTemplateMetadata {
    internalName: string;
    author: Author;
    version?: string;
    website?: string;
    repository?: string;
    name?: LocalisedName[];
    game?: Game;
}

export interface Author {
    email: string;
    name?:  LocalisedName[];
    url?:   string;
    phone?: string;
}

export interface Game {
    internalName: string;
}

export interface LocalisedName {
    language: string;
    content:  string;
}
```

From the root-level metadata, only the `internalName` and `author` are required (and the `email` property of an `author` is required). Other properties are optional, however some optional properties are objects and those objects do have required properties. For example, if you put in a `name` in your metadata, then the `name` value must be an array of objects where ALL objects must contain a `language` and `content` property with string values. 

An example of a full `metadata.json` file is here:

```json
{
  "internalName": "example-template",
  "version": "1.1.1",
  "website": "https://tcgsetdesigner.com/",
  "repository": "https://github.com/BigfootDS/tcgsd-visual-card-base",
  "author": {
    "name": "Alex Stormwood",
    "url": "https://alexstormwood.com/",
    "email": "alex@bigfootds.com"
  },
  "name": [
    {
      "language": "en",
      "content": "TCGSD Example Visual Card Template"
    },
    {
      "language": "jp",
      "content": "TCGSD ビジュアルカードテンプレートの例"
    },
    {
      "language": "fr",
      "content": "Exemple de Modèle de Carte Visuelle TCGSD"
    }
  ],
  "game": {
    "internalName": "ptcg"
  }
}
```

## Publishing

At this point in time, templates can be loaded by either manually placing them directly into the TCGSD API's `templates` directory (explained in the API documentation), or loaded via a URL. The URL should point to the template's releases page, such as: `https://github.com/BigfootDS/tcgsd-visual-card-base/releases`

The API can use that URL to grab the latest release of the template, assuming it exists as a ZIP file in the release itself. If multiple ZIP files are available, all will be downloaded into the TCGSD API.

In this particular repository, an automated GitHub Actions workflow is available to automatically create new releases with a ZIP file containing the compiled HTML template. Every push to the `main` branch of the repository will create a new version of the template, so it would be worthwhile to do development in branches and then merge finished work into the `main` branch when ready to release it.

## Further Support

The whole point of this system is that we don't need to pay the extortionate fees of Adobe or other subscription-based software to create cards. If you need help figuring out the HTML, CSS, and JavaScript required to make your template a reality, please see the central repository for further information on how to contact developers of the TCG Set Designer.

Issues and Discussions in this template's repository should be focused on issues, glitches, bugs, or questions and discussions about this specific example template. Use the central TCG Set Designer repository to discuss things, ask for help, or lodge bugs or other issues about the broader concept of templates as a whole.

The central TCG Set Designer repository is here: [https://github.com/BigfootDS/tcg-set-designer](https://github.com/BigfootDS/tcg-set-designer)
## Developer context

See [CONTEXT.md](CONTEXT.md) and [AGENTS.md](AGENTS.md) before development. Project-wide tooling decisions and next tasks live in the [central repository](https://github.com/BigfootDS/app-tcg-set-designer).
