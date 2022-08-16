# About the 'Project UShell'

This is the idea of building a 'universal' shell in the form of an SPA that can host any web application. The current paradigm of configurable application modules (keyword 'composite application') in combination with the "WebComponents" standard enables us to create a product which is put together from several decentrally hosted components. In addition, an interaction between these modules should be made possible. In addition, it should also be possible to define various standard use cases, such as processing a list of data records in the form of simple CRUD operations, purely configuratively. In the latter case, no frontend development is necessary at all - only a web service in the Backend...



# About this Repo

The  'React Frontend' is the SPA ('Single Page Application') which represents the main entry-point of the Shell!

Here you will find:

* The Menu Structure
* The Management of UseCases and States
* The Management of OAuth-Tokens
* The Service, wich is downloading loading the portfolio-File and aggregating the Metadata of the linked Modules (separate files to download)
* The Container to Display Tabs for the currently active UseCases (showing 'out of the box'-Widgets for common application tasks or embedding external WebComponents)
* An Event-Channel for the interaction between the modules



The Shell can be lauched in two different Modes:

1) the 'default' Mode -> here the shell will load the Portfolio (where all the UseCases and Menu-Entries are defined) and render a Menu, a Tab-Bar and the active UseCases (as tabs).

2) the 'seamless' Mode -> if the Url-Param '...?seamless_usecase=...' is set, then the shell will not render the Menu. Instead of that, the only the addressed UseCase will be rendered! This allows external Shell-Applications (for example a WinForms-Shell) to manage the Tabs and Menupoints externally und just embed a Module from here 



