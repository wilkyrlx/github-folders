/**
 * Enum for the buttons that expand in the ControlPanel. Corresponds to which UI component
 * is actually expanded so that only one ever is expanded
 */
class expandedEnum {
    static readonly FOLDER = new expandedEnum() // add new folder bar expanded 
    static readonly MANUAL = new expandedEnum() // add manual repository button expanded
    static readonly NONE = new expandedEnum() // none expanded

    // private to disallow creating other instances of this type
    private constructor() {}
}

export { expandedEnum }