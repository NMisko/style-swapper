# Atom style-switcher package

Allows to quickly switch between styles.

![Usage](https://raw.githubusercontent.com/NMisko/style-switcher/master/images/example.gif)

WARNING: Writes inside your stylesheet.

Surround parts of your style sheet with the delimiters and give them names of your choice, e.g.:
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
You can then for example switch between `coding` and `writing`. You can freely choose these names and add as many as you want. The package simply comments out the blocks that aren't used. All delimiters can be set in the settings. It's also possible to assign one block to multiple names, e.g.:
```
//--- writing,coding,reading
atom-text-editor {
  font-family: 'century schoolbook';
  font-size: 15px;
}
//-
```
