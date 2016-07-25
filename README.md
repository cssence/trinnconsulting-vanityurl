# Vanity URLs

A stateless URL forwarding service.

## Database

Links are not stored in any database. Details below.

## Startup

Provide a remote JSON file at startup using parameter ``DATA_URL``, e.g. ``DATA_URL=http://example.com/links.json``.

Links should be stored as key/value pairs, like so.

```JSON
{
  "about": "https://trinn.consulting/imprint",
  "get-in-touch": "https://trinn.consulting/contact"
}
```

Any entry found in the JSON object will result in a 301 redirect to the corresponding URL.

If you are running this service on a server that maintains state, you could also point to a local JSON file, but do so in a fully qualified fashion. That said, using a remote file that can be easily edited makes more sense.  

## Static files

Static files are served as-is from the ``/public`` folder. Minimum configuration should include at least an ``index.html`` and a ``404.html``.

Note: Consider the example JSON from the last chapter. If the ``/public`` folder would contain a file named “about”, said file would be returned instead of the redirect.

## Caching

301 redirects are delivered with a ``max-age`` of 24 hours. See ``/routes.js`` for details.

## Modifications

To load data from a different remote location you need to stop the service and start it again with a different ``DATA_URL`` parameter.

If only the content of the already specified remote JSON file changes, there is a special URL that allows you to force a reload.

[http://my-short-doma.in/{sha-1 of DATA_URL}](#)

You will see the __sha-1__ in the log on startup. Triggering this URL will result in a 404, but the reload does take place in the background. For confirmation, you can reveal a list of the current configuration using the following URL.

[http://my-short-doma.in/{sha-1 of DATA_URL}/urls](#)


## Not implemented (yet)

### Statistics

There are no stats on clicks. To find out if a link has been clicked you’d have to browse the logs. 

### Shortening of URLs

There is no shortening mechanism implemented yet, as there is no database to store the result. The remote JSON file is read-only, so shortened URLs would be lost after restarting the service.

However, anything that looks like a shortened URL can be added to the JSON file.
