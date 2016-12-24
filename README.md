# style-swapper package

Allows to quickly switch between styles.

[![Screenshot](https://i.gyazo.com/29ee8101ef122fd85c8ede48cc96b6a1.gif)]

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
