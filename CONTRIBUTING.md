# CONTRIBUTION Instructions

## New features

We are open to contributions for new features and code optimization.

To perform it, just make a PR with a detailed description of the library issues or new features you are proposing.  

## New Theme Templates

To contribute with a new theme follow this guidelines:

* Design your template with the below list of required/optional files.
* Place all files of the theme in the same folder, called with the `keyname` of the theme, and copy into the `theme-list` folder.
* Include the theme and author information in the file `theme-names.js` inside of `theme-list` folder.
* Make a PR with your code. 
    
### Files of your theme

|File|Required|Description|
|----|--------|-----------|
|`index.html`|true|Index page of the theme. It should be made following the exiting template in `material` theme. Please, only change the information that the template allows.|
|`<theme-name>.js`|true|File that include the theme HTML structure. Replace `<theme-name>` with the `keyname` of your theme. This file must be included in your `index.html` file to build a real time example of your template.|
|`image.png`|true|Representative image of how your theme looks like, to include in theme list page.|
|`<theme-name>.css`|false|Styles of your theme. Replace `<theme-name>` with the `keyname` of your theme. This file must be included in your `index.html` file to build a real time example of your template.|

You can include any extra files, JS or JSON for example, all inside the theme folder. Just explain how to use the files of your theme.
    
