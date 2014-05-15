<p>Files:</p>
<ul>
<?php
    if ($handle = opendir('.')) {
        while (false !== ($file = readdir($handle))) {
            echo "	<li><a href=\"$file\">$file</a></li>\n";
        }
        closedir($handle);
   }
?>
</ul>