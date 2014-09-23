module VisitorsHelper

  def render_visitor_photo(photo,size="thumb")
    if photo.present?
      image_url = photo.send(size).url
    else

      case size
      when :medium
        volume = "400x400"
      else
        volume = "100x100"
      end

      image_url = "http://placehold.it/#{volume}&text=No Pic"
    end

    image_tag(image_url, :class => size)
  end

  def render_gamer_photo(photo,size="thumb",length,width,className)
    if photo.present?
      image_url = photo.send(size).url
    else

      case size
      when :medium
        volume = "400x400"
      else
        volume = "100x100"
      end

      image_url = "http://placehold.it/#{volume}&text=No Pic"
    end

    image_tag(image_url, :class => "#{size} #{className}", length: length, width: width)
  end
end
