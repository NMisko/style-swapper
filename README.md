# Atom style-switcher package

Allows to quickly switch between styles.

![Usage](https://raw.githubusercontent.com/NMisko/style-switcher/master/images/example.gif)

WARNING: Writes inside your stylesheet.

Surround parts of your style sheet with the delimiters, e.g.:
```
//--- coding
atom-text-editor {
   font-family: Menlo, Consolas, 'DejaVu Sans Mono', monospace;
   font-size: 13px;
} //-

//--- writing
//atom-text-editor {
//  font-family: 'century schoolbook';
//  font-size: 15px;
//}
//-
```
You can then switch between `coding` and `writing`. The package simply comments out the block that isn't used. The delimiters can be set in the settings. It's also possible to assign one block to multiple names, e.g.:
```
//--- writing,coding,reading
atom-text-editor {
  font-family: 'century schoolbook';
  font-size: 15px;
}
//-
```
