# Inspinia Dashboard

## Usage

Add it as a dependency in your bower.json file as

```json
    "dependencies": {
        "lkmx-inspinia": "git@git.lkmx.io:look-and-feel/inspinia.git#^0.2.2",
    }
```

Then perform `bower install`

To enable Inspinia in your AngularJS 1 project add it as a module in the main app

```javascript
    var exampleApp = angular.module('example-app', ['inspinia', ...]);
```

### Page Layout

A traditional page layout looks like this

```html
    <insp-wrapper>
        <insp-side-navigation>
            <!-- Side navigation content here -->
        </insp-side-navigation>
        <insp-page>
            <insp-top-navigation>
                <!-- Top Navigation content here -->
            </insp-top-navigation>
            <insp-content>
                <!-- Main content here -->
            </insp-content>
            <insp-footer>
                <!-- Footer content here -->
            </insp-footer>
        </insp-page>
    </insp-wrapper>
```

### Breadcrum

Breadcrum is a path for navigation. This element help you to navigate better

```html
    <insp-breadcrumb>
        <insp-breadcrumb-item ui-sref="items.list">Items</insp-breadcrumb-item>
        <insp-breadcrumb-item item-active="true">{{ item.name }}</insp-breadcrumb-item>
    </insp-breadcrumb>
```

### Modal

Modal is a embeded window popup

```html
    <button insp-modal-open="#myModal" class="btn btn-primary">Remove item</button>

    ...

    <insp-modal id="myModal"/>
        <insp-modal-header>Remove item</insp-modal-header>
        <insp-modal-body>Are you sure to remove item?</insp-modal-body>
        <insp-modal-footer class="text-right">
            <button data-dismiss="modal" class="btn btn-default">No</button>
            <button data-dismiss="modal" ng-click="removeItem()" class="btn btn-primary">Yes</button>
        </insp-modal-footer>
    </insp-modal>
```