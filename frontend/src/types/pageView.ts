// Enum corresponding to which view is visible UNDER the ControlPanel
class pageView {
    static readonly MAIN = new pageView() // main view, which is List of StripeItems
    static readonly SETTINGS = new pageView() // settings view

    // private to disallow creating other instances of this type
    private constructor() {}
}

export { pageView }