const FileFinder = (fileName, files = [], id = false) => {
    const fileObject = files.filter(file => file.Description === fileName);

    if (id) {
        return fileObject[0] && (fileObject[0].DocumentId || null);
    }

    return fileObject[0] && (fileObject[0].DocName || null);
}

export default FileFinder
