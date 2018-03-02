for entry in "$search_dir"./src/*/*/*.js
do
  echo "require(\"$entry\")"
done

